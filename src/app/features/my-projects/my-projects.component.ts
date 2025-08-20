import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import type { SortEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TablePageEvent } from 'primeng/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged } from 'rxjs';

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

import { CreateProjectDialogComponent } from '@osf/features/my-projects/components';
import { MyProjectsTableComponent, SelectComponent, SubHeaderComponent } from '@osf/shared/components';
import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { IS_MEDIUM, parseQueryFilterParams } from '@osf/shared/helpers';
import { QueryParams, TableParameters } from '@osf/shared/models';
import { BookmarksSelectors, GetBookmarksCollectionId } from '@osf/shared/stores';
import {
  ClearMyResources,
  GetMyBookmarks,
  GetMyPreprints,
  GetMyProjects,
  GetMyRegistrations,
  MyResourcesSelectors,
} from '@shared/stores';

import { MY_PROJECTS_TABS } from './constants';
import { MyProjectsTab } from './enums';

import { MyResourcesItem, MyResourcesSearchFilters } from 'src/app/shared/models/my-resources';

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

  protected readonly isLoading = signal(false);
  protected readonly isTablet = toSignal(inject(IS_MEDIUM));
  protected readonly tabOptions = MY_PROJECTS_TABS;
  protected readonly tabOption = MyProjectsTab;

  protected readonly searchControl = new FormControl<string>('');

  protected readonly queryParams = toSignal(this.route.queryParams);
  protected readonly currentPage = signal(1);
  protected readonly currentPageSize = signal(MY_PROJECTS_TABLE_PARAMS.rows);
  protected readonly selectedTab = signal(MyProjectsTab.Projects);
  protected readonly activeProject = signal<MyResourcesItem | null>(null);
  protected readonly sortColumn = signal<string | undefined>(undefined);
  protected readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  protected readonly tableParams = signal<TableParameters>({
    ...MY_PROJECTS_TABLE_PARAMS,
    firstRowIndex: 0,
  });

  protected readonly projects = select(MyResourcesSelectors.getProjects);
  protected readonly registrations = select(MyResourcesSelectors.getRegistrations);
  protected readonly preprints = select(MyResourcesSelectors.getPreprints);
  protected readonly bookmarks = select(MyResourcesSelectors.getBookmarks);
  protected readonly totalProjectsCount = select(MyResourcesSelectors.getTotalProjects);
  protected readonly totalRegistrationsCount = select(MyResourcesSelectors.getTotalRegistrations);
  protected readonly totalPreprintsCount = select(MyResourcesSelectors.getTotalPreprints);
  protected readonly totalBookmarksCount = select(MyResourcesSelectors.getTotalBookmarks);

  protected readonly bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);

  protected readonly actions = createDispatchMap({
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
      .subscribe((searchValue) => {
        this.handleSearch(searchValue ?? '');
      });
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
      searchFields: ['title', 'tags', 'description'],
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

  protected onPageChange(event: TablePageEvent): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const currentParams = this.queryParams() || {};

    this.updateQueryParams({
      page,
      size: event.rows,
      sortColumn: currentParams['sortColumn'],
      sortOrder: currentParams['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc,
    });
  }

  protected onSort(event: SortEvent): void {
    if (event.field) {
      this.updateQueryParams({
        sortColumn: event.field,
        sortOrder: event.order === -1 ? SortOrder.Desc : SortOrder.Asc,
      });
    }
  }

  protected onTabChange(tabIndex: number): void {
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

  protected createProject(): void {
    const dialogWidth = this.isTablet() ? '850px' : '95vw';

    this.dialogService.open(CreateProjectDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('myProjects.header.createProject'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  protected navigateToProject(project: MyResourcesItem): void {
    this.activeProject.set(project);
    this.router.navigate([project.id]);
  }

  protected navigateToRegistry(registry: MyResourcesItem): void {
    this.activeProject.set(registry);
    this.router.navigate([registry.id]);
  }
}
