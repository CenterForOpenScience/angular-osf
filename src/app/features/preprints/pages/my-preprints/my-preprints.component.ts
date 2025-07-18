import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged, skip } from 'rxjs';

import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { parseQueryFilterParams } from '@core/helpers';
import { PreprintShortInfo } from '@osf/features/preprints/models';
import { FetchMyPreprints, PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ListInfoShortenerComponent, SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';
import { QueryParams, SearchFilters, TableParameters } from '@shared/models';

@Component({
  selector: 'osf-my-preprints',
  imports: [
    SubHeaderComponent,
    SearchInputComponent,
    TranslatePipe,
    TableModule,
    Skeleton,
    DatePipe,
    ListInfoShortenerComponent,
    TitleCasePipe,
  ],
  templateUrl: './my-preprints.component.html',
  styleUrl: './my-preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyPreprintsComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private actions = createDispatchMap({
    fetchMyPreprints: FetchMyPreprints,
  });

  searchControl = new FormControl<string>('');

  queryParams = toSignal(this.route.queryParams);
  sortColumn = signal('');
  sortOrder = signal<SortOrder>(SortOrder.Asc);
  currentPage = signal(1);
  currentPageSize = signal(TABLE_PARAMS.rows);
  tableParams = signal<TableParameters>({
    ...TABLE_PARAMS,
    firstRowIndex: 0,
  });

  preprints = select(PreprintSelectors.getMyPreprints);
  preprintsTotalCount = select(PreprintSelectors.getMyPreprintsTotalCount);
  areMyPreprintsLoading = select(PreprintSelectors.areMyPreprintsLoading);
  skeletonData: PreprintShortInfo[] = Array.from({ length: 10 }, () => ({}) as PreprintShortInfo);

  constructor() {
    this.setupTotalRecordsEffect();
    this.setupSearchSubscription();
    this.setupQueryParamsEffect();
  }

  navigateToPreprintDetails(preprint: PreprintShortInfo): void {
    this.router.navigateByUrl(`/preprints/${preprint.providerId}/${preprint.id}`);
  }

  onPageChange(event: TablePageEvent): void {
    const page = Math.floor(event.first / event.rows) + 1;

    this.updateQueryParams({
      page,
      size: event.rows,
    });
  }

  onSort(event: SortEvent): void {
    if (event.field) {
      this.updateQueryParams({
        sortColumn: event.field,
        sortOrder: event.order === -1 ? SortOrder.Desc : SortOrder.Asc,
      });
    }
  }

  setupQueryParamsEffect(): void {
    effect(() => {
      const rawQueryParams = this.queryParams();
      if (!rawQueryParams) return;

      const parsedQueryParams = parseQueryFilterParams(rawQueryParams);

      this.updateComponentState(parsedQueryParams);
      const filters = this.createFilters(parsedQueryParams);
      this.actions.fetchMyPreprints(parsedQueryParams.page, parsedQueryParams.size, filters);
    });
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef), skip(1))
      .subscribe((searchControl) => {
        this.updateQueryParams({
          search: searchControl ?? '',
          page: 1,
        });
      });
  }

  private setupTotalRecordsEffect() {
    effect(() => {
      const totalRecords = this.preprintsTotalCount();
      untracked(() => {
        this.updateTableParams({ totalRecords });
      });
    });
  }

  private updateTableParams(updates: Partial<TableParameters>): void {
    this.tableParams.update((current) => ({
      ...current,
      ...updates,
    }));
  }

  private updateQueryParams(updates: Partial<QueryParams>): void {
    const queryParams: Record<string, string | undefined> = {};

    if ('page' in updates) {
      queryParams['page'] = updates.page!.toString();
    }
    if ('size' in updates) {
      queryParams['size'] = updates.size!.toString();
    }
    if ('search' in updates) {
      queryParams['search'] = updates.search || undefined;
    }
    if ('sortColumn' in updates) {
      queryParams['sortColumn'] = updates.sortColumn!;
      queryParams['sortOrder'] = updates.sortOrder === SortOrder.Desc ? 'desc' : 'asc';
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private updateComponentState(params: QueryParams): void {
    untracked(() => {
      this.currentPage.set(params.page);
      this.currentPageSize.set(params.size);
      this.searchControl.setValue(params.search);
      this.sortColumn.set(params.sortColumn);
      this.sortOrder.set(params.sortOrder);

      this.updateTableParams({
        rows: params.size,
        firstRowIndex: (params.page - 1) * params.size,
      });
    });
  }

  private createFilters(params: QueryParams): SearchFilters {
    return {
      searchValue: params.search,
      searchFields: ['title', 'tags', 'description'],
      sortColumn: params.sortColumn,
      sortOrder: params.sortOrder,
    };
  }

  addPreprintBtnClicked() {
    this.router.navigateByUrl('/preprints/select');
  }
}
