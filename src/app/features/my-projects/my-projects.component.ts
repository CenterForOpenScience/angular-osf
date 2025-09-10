import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import type { SortEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TablePageEvent } from 'primeng/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MyProjectsTableComponent, SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { IS_MEDIUM, parseQueryFilterParams } from '@osf/shared/helpers';
import { MyResourcesItem, MyResourcesSearchFilters, QueryParams, TableParameters } from '@osf/shared/models';
import {
  BookmarksSelectors,
  ClearMyResources,
  GetBookmarksCollectionId,
  GetMyBookmarks,
  GetMyPreprints,
  GetMyProjects,
  GetMyRegistrations,
  MyResourcesSelectors,
} from '@osf/shared/stores';
import { ProjectRedirectDialogService } from '@shared/services';

import { CreateProjectDialogComponent } from './components';
import { MY_PROJECTS_TABS } from './constants';
import { MyProjectsTab } from './enums';

@Component({
  selector: 'osf-my-projects',
  imports: [
    SubHeaderComponent,
    FormsModule,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    MyProjectsTableComponent,
    TranslatePipe,
    SelectComponent,
  ],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  readonly dialogService = inject(DialogService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly translateService = inject(TranslateService);
  readonly projectRedirectDialogService = inject(ProjectRedirectDialogService);

  readonly isLoading = signal(false);
  readonly isTablet = toSignal(inject(IS_MEDIUM));
  readonly tabOptions = MY_PROJECTS_TABS;
  readonly tabOption = MyProjectsTab;

  readonly searchControl = new FormControl<string>('');

  readonly queryParams = toSignal(this.route.queryParams);
  readonly currentPage = signal(1);
  readonly currentPageSize = signal(MY_PROJECTS_TABLE_PARAMS.rows);
  readonly selectedTab = signal(MyProjectsTab.Projects);
  readonly activeProject = signal<MyResourcesItem | null>(null);
  readonly sortColumn = signal<string | undefined>(undefined);
  readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  readonly tableParams = signal<TableParameters>({ ...MY_PROJECTS_TABLE_PARAMS, firstRowIndex: 0 });

  readonly projects = select(MyResourcesSelectors.getProjects);
  readonly registrations = select(MyResourcesSelectors.getRegistrations);
  readonly preprints = select(MyResourcesSelectors.getPreprints);
  readonly bookmarks = select(MyResourcesSelectors.getBookmarks);
  readonly totalProjectsCount = select(MyResourcesSelectors.getTotalProjects);
  readonly totalRegistrationsCount = select(MyResourcesSelectors.getTotalRegistrations);
  readonly totalPreprintsCount = select(MyResourcesSelectors.getTotalPreprints);
  readonly totalBookmarksCount = select(MyResourcesSelectors.getTotalBookmarks);

  readonly bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);

  readonly actions = createDispatchMap({
    getBookmarksCollectionId: GetBookmarksCollectionId,
    clearMyProjects: ClearMyResources,
    getMyProjects: GetMyProjects,
    getMyRegistrations: GetMyRegistrations,
    getMyPreprints: GetMyPreprints,
    getMyBookmarks: GetMyBookmarks,
  });

  constructor() {
    this.setupQueryParamsEffect();
    this.setupSearchSubscription();
    this.setupTotalRecordsEffect();
    this.setupCleanup();
  }

  ngOnInit(): void {
    this.actions.getBookmarksCollectionId();
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearMyProjects();
    });
  }

  setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchValue) => this.handleSearch(searchValue ?? ''));
  }

  setupTotalRecordsEffect(): void {
    effect(() => {
      const totalRecords = this.getTotalRecordsForCurrentTab();
      untracked(() => {
        this.updateTableParams({ totalRecords });
      });
    });
  }

  getTotalRecordsForCurrentTab(): number {
    switch (this.selectedTab()) {
      case MyProjectsTab.Projects:
        return this.totalProjectsCount();
      case MyProjectsTab.Registrations:
        return this.totalRegistrationsCount();
      case MyProjectsTab.Preprints:
        return this.totalPreprintsCount();
      case MyProjectsTab.Bookmarks:
        return this.totalBookmarksCount();
      default:
        return 0;
    }
  }

  setupQueryParamsEffect(): void {
    effect(() => {
      const params = this.queryParams();
      if (!params) return;

      const { page, size, search, sortColumn, sortOrder } = parseQueryFilterParams(params);

      this.updateComponentState({ page, size, search, sortColumn, sortOrder });
      this.fetchDataForCurrentTab({
        page,
        size,
        search,
        sortColumn,
        sortOrder,
      });
    });
  }

  updateComponentState(params: QueryParams): void {
    untracked(() => {
      const size = params.size || MY_PROJECTS_TABLE_PARAMS.rows;

      this.currentPage.set(params.page ?? 1);
      this.currentPageSize.set(size);
      this.searchControl.setValue(params.search || '');
      this.sortColumn.set(params.sortColumn);
      this.sortOrder.set(params.sortOrder ?? SortOrder.Asc);

      this.updateTableParams({
        rows: size,
        firstRowIndex: ((params.page ?? 1) - 1) * size,
      });
    });
  }

  updateTableParams(updates: Partial<TableParameters>): void {
    this.tableParams.update((current) => ({
      ...current,
      ...updates,
    }));
  }

  fetchDataForCurrentTab(params: QueryParams): void {
    this.isLoading.set(true);
    const filters = this.createFilters(params);
    const pageNumber = params.page ?? 1;
    const pageSize = params.size ?? MY_PROJECTS_TABLE_PARAMS.rows;

    let action$;
    switch (this.selectedTab()) {
      case MyProjectsTab.Projects:
        action$ = this.actions.getMyProjects(pageNumber, pageSize, filters);
        break;
      case MyProjectsTab.Registrations:
        action$ = this.actions.getMyRegistrations(pageNumber, pageSize, filters);
        break;
      case MyProjectsTab.Preprints:
        action$ = this.actions.getMyPreprints(pageNumber, pageSize, filters);
        break;
      case MyProjectsTab.Bookmarks:
        if (this.bookmarksCollectionId()) {
          action$ = this.actions.getMyBookmarks(
            this.bookmarksCollectionId(),
            pageNumber,
            pageSize,
            filters,
            ResourceType.Null
          );
        }
        break;
    }

    action$?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      complete: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  createFilters(params: QueryParams): MyResourcesSearchFilters {
    return {
      searchValue: params.search || '',
      searchFields:
        this.selectedTab() === MyProjectsTab.Preprints ? ['title', 'tags'] : ['title', 'tags', 'description'],
      sortColumn: params.sortColumn,
      sortOrder: params.sortOrder,
    };
  }

  handleSearch(searchValue: string): void {
    const currentParams = this.queryParams() || {};
    this.updateQueryParams({
      search: searchValue,
      page: 1,
      sortColumn: currentParams['sortColumn'],
      sortOrder: currentParams['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc,
    });
  }

  updateQueryParams(updates: Partial<QueryParams>): void {
    const currentParams = this.queryParams() || {};
    const queryParams: Record<string, string> = {};

    if ('page' in updates || currentParams['page']) {
      queryParams['page'] = updates.page?.toString() ?? currentParams['page'];
    }
    if ('size' in updates || currentParams['size']) {
      queryParams['size'] = updates.size?.toString() ?? currentParams['size'];
    }

    if ('search' in updates || currentParams['search']) {
      const search = updates.search ?? currentParams['search'];
      if (search) {
        queryParams['search'] = search;
      }
    }

    if ('sortColumn' in updates) {
      if (updates.sortColumn) {
        queryParams['sortColumn'] = updates.sortColumn;
        queryParams['sortOrder'] = updates.sortOrder === SortOrder.Desc ? 'desc' : 'asc';
      }
    } else if (currentParams['sortColumn']) {
      queryParams['sortColumn'] = currentParams['sortColumn'];
      queryParams['sortOrder'] = currentParams['sortOrder'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  onPageChange(event: TablePageEvent): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const currentParams = this.queryParams() || {};

    this.updateQueryParams({
      page,
      size: event.rows,
      sortColumn: currentParams['sortColumn'],
      sortOrder: currentParams['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc,
    });
  }

  onSort(event: SortEvent): void {
    if (event.field) {
      this.updateQueryParams({
        sortColumn: event.field,
        sortOrder: event.order as SortOrder,
      });
    }
  }

  onTabChange(tabIndex: number): void {
    this.actions.clearMyProjects();
    this.selectedTab.set(tabIndex);
    const currentParams = this.queryParams() || {};

    this.updateQueryParams({
      page: 1,
      size: currentParams['size'],
      search: '',
      sortColumn: undefined,
      sortOrder: undefined,
    });
  }

  createProject(): void {
    const dialogWidth = this.isTablet() ? '850px' : '95vw';

    this.dialogService
      .open(CreateProjectDialogComponent, {
        width: dialogWidth,
        focusOnShow: false,
        header: this.translateService.instant('myProjects.header.createProject'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(
        filter((result) => result.project.id),
        tap((result) => this.projectRedirectDialogService.showProjectRedirectDialog(result.project.id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  navigateToProject(project: MyResourcesItem): void {
    this.activeProject.set(project);
    this.router.navigate([project.id]);
  }

  navigateToRegistry(registry: MyResourcesItem): void {
    this.activeProject.set(registry);
    this.router.navigate([registry.id]);
  }
}
