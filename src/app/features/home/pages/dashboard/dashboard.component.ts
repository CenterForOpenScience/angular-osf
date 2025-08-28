import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged, take } from 'rxjs';

import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CreateProjectDialogComponent } from '@osf/features/my-projects/components';
import { AccountSettingsService } from '@osf/features/settings/account-settings/services';
import { IconComponent, MyProjectsTableComponent, SubHeaderComponent } from '@osf/shared/components';
import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants';
import { SortOrder } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { MyResourcesItem, MyResourcesSearchFilters, TableParameters } from '@osf/shared/models';
import { ClearMyResources, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores';

import { ConfirmEmailComponent } from '../../components';

@Component({
  selector: 'osf-dashboard',
  imports: [RouterLink, Button, SubHeaderComponent, MyProjectsTableComponent, IconComponent, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DialogService],
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(DialogService);
  private readonly accountSettingsService = inject(AccountSettingsService);

  readonly isMedium = toSignal(inject(IS_MEDIUM));

  readonly searchControl = new FormControl<string>('');
  readonly activeProject = signal<MyResourcesItem | null>(null);
  readonly sortColumn = signal<string | undefined>(undefined);
  readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  readonly tableParams = signal<TableParameters>({ ...MY_PROJECTS_TABLE_PARAMS });

  readonly projects = select(MyResourcesSelectors.getProjects);
  readonly totalProjectsCount = select(MyResourcesSelectors.getTotalProjects);
  readonly areProjectsLoading = select(MyResourcesSelectors.getProjectsLoading);

  readonly actions = createDispatchMap({ getMyProjects: GetMyProjects, clearMyResources: ClearMyResources });

  readonly filteredProjects = computed(() => {
    const search = this.searchControl.value?.toLowerCase() ?? '';
    return this.projects().filter((project) => project.title.toLowerCase().includes(search));
  });

  dialogRef: DynamicDialogRef | null = null;
  emailAddress = '';

  constructor() {
    this.setupSearchSubscription();
    this.setupTotalRecordsEffect();
    this.setupCleanup();
  }

  ngOnInit() {
    this.setupQueryParamsSubscription();

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const userId = params['userId'];
      const token = params['token'];

      if (userId && token) {
        this.accountSettingsService
          .getEmail(token, userId)
          .pipe(take(1))
          .subscribe((email) => {
            this.emailAddress = email.emailAddress;
            this.addAlternateEmail(token);
          });
      }
    });
  }

  addAlternateEmail(token: string) {
    this.translateService.get('home.confirmEmail.title').subscribe((title) => {
      this.dialogRef = this.dialogService.open(ConfirmEmailComponent, {
        width: '448px',
        focusOnShow: false,
        header: title,
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: {
          emailAddress: this.emailAddress,
          userId: this.route.snapshot.params['userId'],
          emailId: this.route.snapshot.params['emailId'],
          token: token,
        },
      });
    });
  }

  setupQueryParamsSubscription(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = Number(params['page']) || 1;
      const rows = Number(params['rows']) || MY_PROJECTS_TABLE_PARAMS.rows;
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
    const dialogWidth = this.isMedium() ? '850px' : '95vw';

    this.dialogService.open(CreateProjectDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('myProjects.header.createProject'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
