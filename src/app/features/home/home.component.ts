import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MY_PROJECTS_TABLE_PARAMS } from '@core/constants/my-projects-table.constants';
import { GetUserInstitutions } from '@osf/features/institutions/store';
import { MyProjectsItem } from '@osf/features/my-projects/entities/my-projects.entities';
import { MyProjectsSearchFilters } from '@osf/features/my-projects/entities/my-projects-search-filters.models';
import {
  ClearMyProjects,
  GetMyProjects,
  MyProjectsSelectors,
} from '@osf/features/my-projects/store';
import { AddProjectFormComponent } from '@shared/components/add-project-form/add-project-form.component';
import { MyProjectsTableComponent } from '@shared/components/my-projects-table/my-projects-table.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { TableParameters } from '@shared/entities/table-parameters.interface';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { SortOrder } from '@shared/utils/sort-order.enum';

@Component({
  selector: 'osf-home',
  standalone: true,
  imports: [
    RouterLink,
    Button,
    SubHeaderComponent,
    MyProjectsTableComponent,
    TranslatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DialogService],
})
export class HomeComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #translateService = inject(TranslateService);
  readonly #dialogService = inject(DialogService);
  readonly #isXSmall$ = inject(IS_XSMALL);
  readonly #isMedium$ = inject(IS_MEDIUM);
  readonly #searchSubject = new Subject<string>();

  protected readonly isLoading = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly isMedium = toSignal(this.#isMedium$);
  protected readonly isMobile = toSignal(this.#isXSmall$);

  protected readonly activeProject = signal<MyProjectsItem | null>(null);
  protected readonly searchValue = signal('');
  protected readonly sortColumn = signal<string | undefined>(undefined);
  protected readonly sortOrder = signal<SortOrder>(SortOrder.Asc);
  protected readonly tableParams = signal<TableParameters>({
    ...MY_PROJECTS_TABLE_PARAMS,
  });

  protected readonly projects = this.#store.selectSignal(
    MyProjectsSelectors.getProjects,
  );
  protected readonly totalProjectsCount = this.#store.selectSignal(
    MyProjectsSelectors.getTotalProjectsCount,
  );

  protected readonly filteredProjects = computed(() => {
    const search = this.searchValue().toLowerCase();
    return this.projects().filter((project) =>
      project.title.toLowerCase().includes(search),
    );
  });

  constructor() {
    this.#setupSearchSubscription();
    this.#setupTotalRecordsEffect();
    this.#setupCleanup();
  }

  ngOnInit() {
    this.#setupQueryParamsSubscription();
    this.#store.dispatch(new GetUserInstitutions());
  }

  #setupQueryParamsSubscription(): void {
    this.#route.queryParams
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((params) => {
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
          this.searchValue.set(search);
        }

        this.#fetchProjects();
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
      const total = this.totalProjectsCount();
      this.tableParams.update((current) => ({
        ...current,
        totalRecords: total,
      }));
    });
  }

  #setupCleanup(): void {
    this.#destroyRef.onDestroy(() => {
      this.#store.dispatch(new ClearMyProjects());
    });
  }

  #fetchProjects(): void {
    this.isLoading.set(true);
    const filters = this.#createFilters();
    const page =
      Math.floor(this.tableParams().firstRowIndex / this.tableParams().rows) +
      1;
    this.#store
      .dispatch(new GetMyProjects(page, this.tableParams().rows, filters))
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        complete: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  #createFilters(): MyProjectsSearchFilters {
    return {
      searchValue: this.searchValue(),
      searchFields: ['title'],
      sortColumn: this.sortColumn(),
      sortOrder: this.sortOrder(),
    };
  }

  #handleSearch(searchValue: string): void {
    this.searchValue.set(searchValue);
    this.#updateQueryParams();
  }

  #updateQueryParams(): void {
    const page =
      Math.floor(this.tableParams().firstRowIndex / this.tableParams().rows) +
      1;
    const queryParams = {
      page,
      rows: this.tableParams().rows,
      search: this.searchValue() || undefined,
      sortField: this.sortColumn() || undefined,
      sortOrder: this.sortOrder() || undefined,
    };

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.#searchSubject.next(value);
  }

  protected onPageChange(event: TablePageEvent): void {
    this.tableParams.update((current) => ({
      ...current,
      rows: event.rows,
      firstRowIndex: event.first,
    }));
    this.#updateQueryParams();
  }

  protected onSort(event: SortEvent): void {
    if (event.field) {
      this.sortColumn.set(event.field);
      this.sortOrder.set(event.order === -1 ? SortOrder.Desc : SortOrder.Asc);
      this.#updateQueryParams();
    }
  }

  protected navigateToProject(project: MyProjectsItem): void {
    this.activeProject.set(project);
    this.#router.navigate(['/my-projects', project.id]);
  }

  protected createProject(): void {
    const dialogWidth = this.isMobile() ? '95vw' : '850px';
    this.isSubmitting.set(true);

    const dialogRef = this.#dialogService.open(AddProjectFormComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.#translateService.instant('myProjects.header.createProject'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });

    dialogRef.onClose.subscribe(() => {
      this.isSubmitting.set(false);
    });
  }
}
