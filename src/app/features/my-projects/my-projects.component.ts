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
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IS_MEDIUM, IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { TabOption } from '@shared/entities/tab-option.interface';
import { TablePageEvent } from 'primeng/table';
import type { SortEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AddProjectFormComponent } from '@shared/components/add-project-form/add-project-form.component';
import { Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetMyProjects,
  MyProjectsSelectors,
  ClearMyProjects,
  GetMyRegistrations,
  GetMyPreprints,
  GetBookmarksCollectionId,
  GetMyBookmarks,
} from '@osf/features/my-projects/store';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MyProjectsSearchFilters } from '@osf/features/my-projects/entities/my-projects-search-filters.models';
import { TableParameters } from '@shared/entities/table-parameters.interface';
import { MY_PROJECTS_TABLE_PARAMS } from '@core/constants/my-projects-table.constants';
import { parseQueryFilterParams } from '@core/helpers/http.helper';
import { SortOrder } from '@shared/utils/sort-order.enum';
import { MyProjectsItem } from '@osf/features/my-projects/entities/my-projects.entities';
import { QueryParams } from '@osf/shared/entities/query-params.interface';
import { MyProjectsTableComponent } from '@shared/components/my-projects-table/my-projects-table.component';
import { GetUserInstitutions } from '@osf/features/institutions/store';

@Component({
  selector: 'osf-my-projects',
  imports: [
    SubHeaderComponent,
    DropdownModule,
    FormsModule,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    MyProjectsTableComponent,
  ],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProjectsComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #dialogService = inject(DialogService);
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #searchSubject = new Subject<string>();

  protected readonly defaultTabValue = 0;
  protected readonly isLoading = signal(false);
  protected readonly isDesktop = toSignal(inject(IS_WEB));
  protected readonly isTablet = toSignal(inject(IS_MEDIUM));
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly tabOptions: TabOption[] = [
    { label: 'My Projects', value: 0 },
    { label: 'My Registrations', value: 1 },
    { label: 'My Preprints', value: 2 },
    { label: 'Bookmarks', value: 3 },
  ];

  protected readonly queryParams = toSignal(this.#route.queryParams);
  protected readonly currentPage = signal(1);
  protected readonly currentPageSize = signal(MY_PROJECTS_TABLE_PARAMS.rows);
  protected readonly searchValue = signal('');
  protected readonly selectedTab = signal(this.defaultTabValue);
  protected readonly activeProject = signal<MyProjectsItem | null>(null);
  protected readonly sortColumn = signal<string | undefined>(undefined);
  protected readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  protected readonly tableParams = signal<TableParameters>({
    ...MY_PROJECTS_TABLE_PARAMS,
    firstRowIndex: 0,
  });

  protected readonly projects = this.#store.selectSignal(
    MyProjectsSelectors.getProjects,
  );
  protected readonly registrations = this.#store.selectSignal(
    MyProjectsSelectors.getRegistrations,
  );
  protected readonly preprints = this.#store.selectSignal(
    MyProjectsSelectors.getPreprints,
  );
  protected readonly bookmarks = this.#store.selectSignal(
    MyProjectsSelectors.getBookmarks,
  );
  protected readonly totalProjectsCount = this.#store.selectSignal(
    MyProjectsSelectors.getTotalProjectsCount,
  );
  protected readonly totalRegistrationsCount = this.#store.selectSignal(
    MyProjectsSelectors.getTotalRegistrationsCount,
  );
  protected readonly totalPreprintsCount = this.#store.selectSignal(
    MyProjectsSelectors.getTotalPreprintsCount,
  );
  protected readonly totalBookmarksCount = this.#store.selectSignal(
    MyProjectsSelectors.getTotalBookmarksCount,
  );

  protected readonly bookmarksCollectionId = this.#store.selectSignal(
    MyProjectsSelectors.getBookmarksCollectionId,
  );

  constructor() {
    this.#setupQueryParamsEffect();
    this.#setupSearchSubscription();
    this.#setupTotalRecordsEffect();
    this.#setupCleanup();
  }

  ngOnInit(): void {
    this.#store.dispatch(new GetUserInstitutions());
    this.#store.dispatch(new GetBookmarksCollectionId());
  }

  #setupCleanup(): void {
    this.#destroyRef.onDestroy(() => {
      this.#store.dispatch(new ClearMyProjects());
    });
  }

  #setupSearchSubscription(): void {
    this.#searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((searchValue) => {
        this.#handleSearch(searchValue);
      });
  }

  #setupTotalRecordsEffect(): void {
    effect(() => {
      const totalRecords = this.#getTotalRecordsForCurrentTab();
      untracked(() => {
        this.#updateTableParams({ totalRecords });
      });
    });
  }

  #getTotalRecordsForCurrentTab(): number {
    switch (this.selectedTab()) {
      case 0:
        return this.totalProjectsCount();
      case 1:
        return this.totalRegistrationsCount();
      case 2:
        return this.totalPreprintsCount();
      case 3:
        return this.totalBookmarksCount();
      default:
        return 0;
    }
  }

  #setupQueryParamsEffect(): void {
    effect(() => {
      const params = this.queryParams();
      if (!params) return;

      const { page, size, search, sortColumn, sortOrder } =
        parseQueryFilterParams(params);

      this.#updateComponentState({ page, size, search, sortColumn, sortOrder });
      this.#fetchDataForCurrentTab({
        page,
        size,
        search,
        sortColumn,
        sortOrder,
      });
    });
  }

  #updateComponentState(params: QueryParams): void {
    untracked(() => {
      const size = params.size || MY_PROJECTS_TABLE_PARAMS.rows;

      this.currentPage.set(params.page ?? 1);
      this.currentPageSize.set(size);
      this.searchValue.set(params.search || '');
      this.sortColumn.set(params.sortColumn);
      this.sortOrder.set(params.sortOrder ?? SortOrder.Asc);

      this.#updateTableParams({
        rows: size,
        firstRowIndex: ((params.page ?? 1) - 1) * size,
      });
    });
  }

  #updateTableParams(updates: Partial<TableParameters>): void {
    this.tableParams.update((current) => ({
      ...current,
      ...updates,
    }));
  }

  #fetchDataForCurrentTab(params: QueryParams): void {
    this.isLoading.set(true);
    const filters = this.#createFilters(params);
    const pageNumber = params.page ?? 1;
    const pageSize = params.size ?? MY_PROJECTS_TABLE_PARAMS.rows;

    let action$;
    switch (this.selectedTab()) {
      case 0:
        action$ = this.#store.dispatch(
          new GetMyProjects(pageNumber, pageSize, filters),
        );
        break;
      case 1:
        action$ = this.#store.dispatch(
          new GetMyRegistrations(pageNumber, pageSize, filters),
        );
        break;
      case 2:
        action$ = this.#store.dispatch(
          new GetMyPreprints(pageNumber, pageSize, filters),
        );
        break;
      case 3:
        if (this.bookmarksCollectionId()) {
          action$ = this.#store.dispatch(
            new GetMyBookmarks(
              this.bookmarksCollectionId(),
              pageNumber,
              pageSize,
              filters,
            ),
          );
        }
        break;
    }

    action$?.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      complete: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  #createFilters(params: QueryParams): MyProjectsSearchFilters {
    return {
      searchValue: params.search || '',
      searchFields: ['title', 'tags', 'description'],
      sortColumn: params.sortColumn,
      sortOrder: params.sortOrder,
    };
  }

  #handleSearch(searchValue: string): void {
    const currentParams = this.queryParams() || {};
    this.#updateQueryParams({
      search: searchValue,
      page: 1,
      sortColumn: currentParams['sortColumn'],
      sortOrder:
        currentParams['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc,
    });
  }

  #updateQueryParams(updates: Partial<QueryParams>): void {
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
        queryParams['sortOrder'] =
          updates.sortOrder === SortOrder.Desc ? 'desc' : 'asc';
      }
    } else if (currentParams['sortColumn']) {
      queryParams['sortColumn'] = currentParams['sortColumn'];
      queryParams['sortOrder'] = currentParams['sortOrder'];
    }

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams,
    });
  }

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.#searchSubject.next(value);
  }

  protected onPageChange(event: TablePageEvent): void {
    const page = Math.floor(event.first / event.rows) + 1;
    const currentParams = this.queryParams() || {};

    this.#updateQueryParams({
      page,
      size: event.rows,
      sortColumn: currentParams['sortColumn'],
      sortOrder:
        currentParams['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc,
    });
  }

  protected onSort(event: SortEvent): void {
    if (event.field) {
      this.#updateQueryParams({
        sortColumn: event.field,
        sortOrder: event.order === -1 ? SortOrder.Desc : SortOrder.Asc,
      });
    }
  }

  protected onTabChange(tabIndex: number): void {
    this.#store.dispatch(new ClearMyProjects());
    this.selectedTab.set(tabIndex);
    const currentParams = this.queryParams() || {};

    this.#updateQueryParams({
      page: 1,
      size: currentParams['size'],
      search: '',
      sortColumn: undefined,
      sortOrder: undefined,
    });
  }

  protected createProject(): void {
    const dialogWidth = this.isMobile() ? '95vw' : '850px';

    this.#dialogService.open(AddProjectFormComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: 'Create Project',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  protected navigateToProject(project: MyProjectsItem): void {
    this.activeProject.set(project);
    this.#router.navigate(['/my-projects', project.id]);
  }
}
