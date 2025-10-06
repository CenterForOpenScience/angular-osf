import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button } from 'primeng/button';
import { TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { CreateProjectDialogComponent } from '@osf/features/my-projects/components';
import {
  IconComponent,
  LoadingSpinnerComponent,
  MyProjectsTableComponent,
  SubHeaderComponent,
} from '@osf/shared/components';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { SortOrder } from '@osf/shared/enums';
import { MyResourcesItem, MyResourcesSearchFilters, TableParameters } from '@osf/shared/models';
import { CustomDialogService, ProjectRedirectDialogService } from '@osf/shared/services';
import { ClearMyResources, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores';

@Component({
  selector: 'osf-dashboard',
  imports: [
    RouterLink,
    Button,
    SubHeaderComponent,
    MyProjectsTableComponent,
    IconComponent,
    TranslatePipe,
    LoadingSpinnerComponent,
    ScheduledBannerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly projectRedirectDialogService = inject(ProjectRedirectDialogService);

  readonly searchControl = new FormControl<string>('');
  readonly activeProject = signal<MyResourcesItem | null>(null);
  readonly sortColumn = signal<string | undefined>(undefined);
  readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  readonly tableParams = signal<TableParameters>({ ...DEFAULT_TABLE_PARAMS });

  readonly projects = select(MyResourcesSelectors.getProjects);
  readonly totalProjectsCount = select(MyResourcesSelectors.getTotalProjects);
  readonly areProjectsLoading = select(MyResourcesSelectors.getProjectsLoading);

  readonly actions = createDispatchMap({ getMyProjects: GetMyProjects, clearMyResources: ClearMyResources });

  readonly filteredProjects = computed(() => {
    const search = this.searchControl.value?.toLowerCase() ?? '';
    return this.projects().filter((project) => project.title.toLowerCase().includes(search));
  });

  readonly existsProjects = computed(() => this.projects().length || !!this.searchControl.value?.length);

  emailAddress = '';

  constructor() {
    this.setupSearchSubscription();
    this.setupTotalRecordsEffect();
    this.setupCleanup();
  }

  ngOnInit() {
    this.setupQueryParamsSubscription();
  }

  setupQueryParamsSubscription(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = Number(params['page']) || 1;
      const rows = Number(params['rows']) || DEFAULT_TABLE_PARAMS.rows;
      const sortField = params['sortField'];
      const sortOrder = params['sortOrder'] as SortOrder;
      const search = params['search'] || '';

      this.tableParams.update((current) => ({
        ...current,
        firstRowIndex: (page - 1) * rows,
        rows,
      }));

      if (sortField) {
        this.sortColumn.set(sortField);
        this.sortOrder.set(+sortOrder || SortOrder.Asc);
      }

      if (search) {
        this.searchControl.setValue(search);
      }

      this.fetchProjects();
    });
  }

  setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateQueryParams(true));
  }

  setupTotalRecordsEffect(): void {
    effect(() => {
      const total = this.totalProjectsCount();
      this.tableParams.update((current) => ({
        ...current,
        totalRecords: total,
      }));
    });
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearMyResources();
    });
  }

  fetchProjects(): void {
    const filters = this.createFilters();
    const page = Math.floor(this.tableParams().firstRowIndex / this.tableParams().rows) + 1;
    this.actions.getMyProjects(page, this.tableParams().rows, filters);
  }

  createFilters(): MyResourcesSearchFilters {
    return {
      searchValue: this.searchControl.value ?? '',
      searchFields: ['title'],
      sortColumn: this.sortColumn(),
      sortOrder: this.sortOrder(),
    };
  }

  updateQueryParams(isSearch = false): void {
    const page = isSearch ? 1 : Math.floor(this.tableParams().firstRowIndex / this.tableParams().rows) + 1;
    const queryParams = {
      page,
      rows: this.tableParams().rows,
      search: this.searchControl.value || undefined,
      sortField: this.sortColumn() || undefined,
      sortOrder: this.sortOrder() || undefined,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(event: TablePageEvent): void {
    this.tableParams.update((current) => ({
      ...current,
      rows: event.rows,
      firstRowIndex: event.first,
    }));

    this.updateQueryParams();
  }

  onSort(event: SortEvent): void {
    if (event.field) {
      this.sortColumn.set(event.field);
      this.sortOrder.set(event.order as SortOrder);
      this.updateQueryParams();
    }
  }

  navigateToProject(project: MyResourcesItem): void {
    this.activeProject.set(project);
    this.router.navigate([project.id]);
  }

  createProject(): void {
    this.customDialogService
      .open(CreateProjectDialogComponent, { header: 'myProjects.header.createProject', width: '850px' })
      .onClose.pipe(
        filter((result) => result?.project.id),
        tap((result) => this.projectRedirectDialogService.showProjectRedirectDialog(result.project.id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  openInfoLink(): void {
    window.open('https://help.osf.io/', '_blank');
  }
}
