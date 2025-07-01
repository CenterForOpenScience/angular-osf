import { select, Store } from '@ngxs/store';

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

import { MY_PROJECTS_TABLE_PARAMS } from '@osf/core/constants';
import { MyProjectsItem } from '@osf/features/my-projects/models';
import { AddProjectFormComponent, MyProjectsTableComponent, SubHeaderComponent } from '@osf/shared/components';
import { SortOrder } from '@osf/shared/enums';
import { TableParameters } from '@osf/shared/models';
import { IS_MEDIUM } from '@osf/shared/utils';
import { GetUserInstitutions } from '@shared/stores';

import { MyProjectsSearchFilters } from '../my-projects/models';
import { ClearMyProjects, GetMyProjects, MyProjectsSelectors } from '../my-projects/store';
import { AccountSettingsService } from '../settings/account-settings/services';

import { ConfirmEmailComponent } from './components';

@Component({
  selector: 'osf-home',
  imports: [RouterLink, Button, SubHeaderComponent, MyProjectsTableComponent, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DialogService],
})
export class HomeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(DialogService);
  private readonly accountSettingsService = inject(AccountSettingsService);

  protected readonly isLoading = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly isMedium = toSignal(inject(IS_MEDIUM));

  protected readonly searchControl = new FormControl<string>('');
  protected readonly activeProject = signal<MyProjectsItem | null>(null);
  protected readonly sortColumn = signal<string | undefined>(undefined);
  protected readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  protected readonly tableParams = signal<TableParameters>({
    ...MY_PROJECTS_TABLE_PARAMS,
  });

  protected readonly projects = select(MyProjectsSelectors.getProjects);
  protected readonly totalProjectsCount = select(MyProjectsSelectors.getTotalProjects);

  protected readonly filteredProjects = computed(() => {
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
    this.store.dispatch(new GetUserInstitutions());

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
        this.sortOrder.set(sortOrder || SortOrder.Asc);
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
      this.store.dispatch(new ClearMyProjects());
    });
  }

  fetchProjects(): void {
    this.isLoading.set(true);
    const filters = this.createFilters();
    const page = Math.floor(this.tableParams().firstRowIndex / this.tableParams().rows) + 1;
    this.store
      .dispatch(new GetMyProjects(page, this.tableParams().rows, filters))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  createFilters(): MyProjectsSearchFilters {
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

  protected onPageChange(event: TablePageEvent): void {
    this.tableParams.update((current) => ({
      ...current,
      rows: event.rows,
      firstRowIndex: event.first,
    }));

    this.updateQueryParams();
  }

  protected onSort(event: SortEvent): void {
    if (event.field) {
      this.sortColumn.set(event.field);
      this.sortOrder.set(event.order === -1 ? SortOrder.Desc : SortOrder.Asc);
      this.updateQueryParams();
    }
  }

  protected navigateToProject(project: MyProjectsItem): void {
    this.activeProject.set(project);
    this.router.navigate(['/my-projects', project.id]);
  }

  protected createProject(): void {
    const dialogWidth = this.isMedium() ? '850px' : '95vw';
    this.isSubmitting.set(true);

    this.dialogService
      .open(AddProjectFormComponent, {
        width: dialogWidth,
        focusOnShow: false,
        header: this.translateService.instant('myProjects.header.createProject'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.subscribe(() => {
        this.isSubmitting.set(false);
      });
  }
}
