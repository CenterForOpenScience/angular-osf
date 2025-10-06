import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import type { SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/helpers';
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
import { CustomDialogService, ProjectRedirectDialogService } from '@shared/services';

import { MyProjectsQueryService } from './services/my-projects-query.service';
import { MyProjectsTableParamsService } from './services/my-projects-table-params.service';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  readonly customDialogService = inject(CustomDialogService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly projectRedirectDialogService = inject(ProjectRedirectDialogService);
  readonly queryService = inject(MyProjectsQueryService);
  readonly tableParamsService = inject(MyProjectsTableParamsService);

  readonly bookmarksPageSize = 100;
  readonly isLoading = signal(false);
  readonly isMedium = toSignal(inject(IS_MEDIUM));
  readonly tabOptions = MY_PROJECTS_TABS;
  readonly tabOption = MyProjectsTab;

  readonly searchControl = new FormControl<string>('');

  readonly queryParams = toSignal(this.route.queryParams);
  readonly currentPage = signal(1);
  readonly currentPageSize = signal(DEFAULT_TABLE_PARAMS.rows);
  readonly selectedTab = signal(MyProjectsTab.Projects);
  readonly activeProject = signal<MyResourcesItem | null>(null);
  readonly sortColumn = signal<string | undefined>(undefined);
  readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  readonly tableParams = signal<TableParameters>({ ...DEFAULT_TABLE_PARAMS, firstRowIndex: 0 });

  readonly projects = select(MyResourcesSelectors.getProjects);
  readonly registrations = select(MyResourcesSelectors.getRegistrations);
  readonly preprints = select(MyResourcesSelectors.getPreprints);
  readonly bookmarks = select(MyResourcesSelectors.getBookmarks);
  readonly totalProjectsCount = select(MyResourcesSelectors.getTotalProjects);
  readonly totalRegistrationsCount = select(MyResourcesSelectors.getTotalRegistrations);
  readonly totalPreprintsCount = select(MyResourcesSelectors.getTotalPreprints);
  readonly totalBookmarksCount = select(MyResourcesSelectors.getTotalBookmarks);
  readonly bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  readonly isBookmarks = computed(() => this.selectedTab() === MyProjectsTab.Bookmarks);

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
    this.setupBookmarksCollectionEffect();
    this.setupCleanup();
  }

  ngOnInit(): void {
    this.actions.getBookmarksCollectionId();
  }

  onPageChange(event: TablePageEvent): void {
    const current = this.queryService.getRawParams();
    this.queryService.handlePageChange(event.first, event.rows, current, this.selectedTab());
  }

  onSort(event: SortEvent): void {
    if (event.field) {
      const current = this.queryService.getRawParams();
      this.queryService.handleSort(event.field, event.order as SortOrder, current, this.selectedTab());
    }
  }

  onTabChange(tabIndex: number): void {
    this.actions.clearMyProjects();
    this.selectedTab.set(tabIndex);
    const current = this.queryService.getRawParams();
    this.queryService.handleTabSwitch(current, this.selectedTab());
  }

  createProject(): void {
    this.customDialogService
      .open(CreateProjectDialogComponent, {
        header: 'myProjects.header.createProject',
        width: '850px',
      })
      .onClose.pipe(
        filter((result) => result?.project.id),
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

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearMyProjects();
    });
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchValue) => this.handleSearch(searchValue ?? ''));
  }

  private setupTotalRecordsEffect(): void {
    effect(() => {
      const totalRecords = this.getTotalRecordsForCurrentTab();
      untracked(() => {
        this.updateTableParams({ totalRecords });
      });
    });
  }

  private setupBookmarksCollectionEffect(): void {
    effect(() => {
      const collectionId = this.bookmarksCollectionId();
      const params = this.queryParams();

      if (collectionId && this.isBookmarks() && params) {
        untracked(() => {
          const queryParams = this.queryService.toQueryModel(params);
          this.updateComponentState(queryParams);
          this.fetchDataForCurrentTab(queryParams);
        });
      }
    });
  }

  private getTotalRecordsForCurrentTab(): number {
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

  private setupQueryParamsEffect(): void {
    effect(() => {
      const params = this.queryParams();
      if (!params) return;

      const raw = params;

      if (!this.queryService.hasTabInUrl(raw)) {
        untracked(() => {
          const current = this.queryParams() || {};
          this.queryService.updateParams({ page: 1 }, current, this.selectedTab());
        });
        return;
      }

      untracked(() => {
        const tabFromUrl = this.queryService.getTabFromUrl(raw);
        if (tabFromUrl !== null && this.selectedTab() !== tabFromUrl) {
          this.selectedTab.set(tabFromUrl);
        }

        if (!this.isBookmarks()) {
          const queryParams = this.queryService.toQueryModel(raw);
          this.updateComponentState(queryParams);
          this.fetchDataForCurrentTab(queryParams);
        }
      });
    });
  }

  private updateComponentState(params: QueryParams): void {
    untracked(() => {
      const size = params.size || DEFAULT_TABLE_PARAMS.rows;

      this.currentPage.set(params.page ?? 1);
      this.currentPageSize.set(size);
      this.searchControl.setValue(params.search || '', { emitEvent: false });
      this.sortColumn.set(params.sortColumn);
      this.sortOrder.set(params.sortOrder ?? SortOrder.Asc);

      const totalRecords = this.getTotalRecordsForCurrentTab();
      const tableParams = this.tableParamsService.buildTableParams(size, totalRecords, this.isBookmarks());
      tableParams.firstRowIndex = ((params.page ?? 1) - 1) * size;

      this.tableParams.set({
        ...tableParams,
        rows: size,
      });
    });
  }

  private updateTableParams(updates: Partial<TableParameters>): void {
    this.tableParams.update((current) => ({
      ...current,
      ...updates,
    }));
  }

  private fetchDataForCurrentTab(params: QueryParams): void {
    this.isLoading.set(true);
    const filters = this.createFilters(params);
    const pageNumber = params.page ?? 1;
    const pageSize = params.size ?? DEFAULT_TABLE_PARAMS.rows;

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
            this.bookmarksPageSize,
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

  private createFilters(params: QueryParams): MyResourcesSearchFilters {
    return {
      searchValue: params.search || '',
      searchFields:
        this.selectedTab() === MyProjectsTab.Preprints ? ['title', 'tags'] : ['title', 'tags', 'description'],
      sortColumn: params.sortColumn,
      sortOrder: params.sortOrder,
    };
  }

  private handleSearch(searchValue: string): void {
    const current = this.queryService.getRawParams();
    this.queryService.handleSearch(searchValue, current, this.selectedTab());
  }
}
