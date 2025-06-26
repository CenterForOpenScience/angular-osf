import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { DatePipe } from '@angular/common';
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
import { Meeting } from '@osf/features/meetings/models';
import { GetAllMeetings, MeetingsSelectors } from '@osf/features/meetings/store';
import { IS_XSMALL } from '@osf/shared/utils';
import { SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';
import { QueryParams, TableParameters } from '@shared/models';
import { SearchFilters } from '@shared/models/filters';

@Component({
  selector: 'osf-meetings-landing',
  imports: [SubHeaderComponent, Card, SearchInputComponent, DatePipe, TableModule, TranslatePipe, Skeleton],
  templateUrl: './meetings-landing.component.html',
  styleUrl: './meetings-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingsLandingComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  readonly isXSmall = toSignal(inject(IS_XSMALL));
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly actions = createDispatchMap({ getMeetings: GetAllMeetings });

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

  meetings = select(MeetingsSelectors.getAllMeetings);
  totalMeetingsCount = select(MeetingsSelectors.getMeetingsTotalCount);
  isMeetingsLoading = select(MeetingsSelectors.isMeetingsLoading);
  skeletonData: Meeting[] = Array.from({ length: 10 }, () => ({}) as Meeting);

  constructor() {
    this.setupTotalRecordsEffect();
    this.setupSearchSubscription();
    this.setupQueryParamsEffect();
  }

  navigateToMeeting(meeting: Meeting): void {
    this.router.navigate(['/meetings', meeting.id]);
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
      this.actions.getMeetings(parsedQueryParams.page, parsedQueryParams.size, filters);
    });
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchControl) => {
        this.updateQueryParams({
          search: searchControl ?? '',
          page: 1,
        });
      });
  }

  private setupTotalRecordsEffect() {
    effect(() => {
      const totalRecords = this.totalMeetingsCount();
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
      searchFields: ['name'],
      sortColumn: params.sortColumn,
      sortOrder: params.sortOrder,
    };
  }
}
