import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged, map, of, Subject, switchMap } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { parseQueryFilterParams } from '@core/helpers/http.helper';
import { MEETING_SUBMISSIONS_TABLE_PARAMS } from '@osf/features/meetings/constants';
import { MeetingSubmission } from '@osf/features/meetings/models';
import { GetMeetingById, GetMeetingSubmissions, MeetingsSelectors } from '@osf/features/meetings/store';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { QueryParams } from '@shared/entities/query-params.interface';
import { TableParameters } from '@shared/entities/table-parameters.interface';
import { SearchFilters } from '@shared/models/filters';
import { SortOrder } from '@shared/utils/sort-order.enum';

@Component({
  selector: 'osf-meeting-details',
  imports: [
    SubHeaderComponent,
    SearchInputComponent,
    DatePipe,
    TableModule,
    Button,
    RouterLink,
    TranslatePipe,
    Skeleton,
  ],
  templateUrl: './meeting-details.component.html',
  styleUrl: './meeting-details.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingDetailsComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly datePipe = inject(DatePipe);
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly actions = createDispatchMap({
    getMeetingSubmissions: GetMeetingSubmissions,
    getMeetingById: GetMeetingById,
  });
  private readonly searchSubject = new Subject<string>();

  queryParams = toSignal(this.route.queryParams);
  searchValue = signal('');
  sortColumn = signal('');
  sortOrder = signal<SortOrder>(SortOrder.Asc);
  currentPage = signal(1);
  currentPageSize = signal(MEETING_SUBMISSIONS_TABLE_PARAMS.rows);
  tableParams = signal<TableParameters>({
    ...MEETING_SUBMISSIONS_TABLE_PARAMS,
    firstRowIndex: 0,
  });

  meetingId = toSignal(
    this.route.params.pipe(
      map((params) => params['id']),
      switchMap((meetingId) => {
        const meeting = this.store.selectSnapshot(MeetingsSelectors.getMeetingById)(meetingId);
        if (!meeting) {
          this.actions.getMeetingById(meetingId);
        }
        return of(meetingId);
      })
    )
  );
  meeting = computed(() => {
    const id = this.meetingId();
    if (!id) return null;
    const meetingSelector = this.store.selectSignal(MeetingsSelectors.getMeetingById)();
    return meetingSelector(id);
  });
  meetingSubmissions = select(MeetingsSelectors.getAllMeetingSubmissions);
  totalMeetingSubmissionsCount = select(MeetingsSelectors.getMeetingSubmissionsTotalCount);
  isMeetingSubmissionsLoading = select(MeetingsSelectors.isMeetingSubmissionsLoading);
  skeletonData: number[] = Array.from({ length: 10 }, () => 1);

  pageDescription = computed(() => {
    const meeting = this.meeting();
    if (!meeting) {
      return '';
    }

    return `${meeting.location} | ${this.datePipe.transform(meeting.startDate, 'MMM d, y')}
    - ${this.datePipe.transform(meeting.endDate, 'MMM d, y')}`;
  });

  constructor() {
    this.setupTotalRecordsEffect();
    this.setupSearchSubscription();
    this.setupQueryParamsEffect();
  }

  downloadSubmission(event: Event, item: MeetingSubmission) {
    event.stopPropagation();

    if (!item.downloadLink) {
      return;
    }

    window.open(item.downloadLink, '_blank');
  }

  onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.searchSubject.next(value);
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
      if (this.meeting()) {
        this.actions.getMeetingSubmissions(this.meeting()!.id, parsedQueryParams.page, parsedQueryParams.size, filters);
      }
    });
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchValue) => {
        this.updateQueryParams({
          search: searchValue,
          page: 1,
        });
      });
  }

  private setupTotalRecordsEffect() {
    effect(() => {
      const totalRecords = this.totalMeetingSubmissionsCount();
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
      this.searchValue.set(params.search);
      this.sortColumn.set(params.sortColumn);
      this.sortOrder.set(params.sortOrder);

      this.updateTableParams({
        rows: params.size,
        firstRowIndex: ((params.page ?? 1) - 1) * params.size,
      });
    });
  }

  private createFilters(params: QueryParams): SearchFilters {
    return {
      searchValue: params.search,
      searchFields: ['title', 'author_name', 'meeting_category'],
      sortColumn: params.sortColumn,
      sortOrder: params.sortOrder,
    };
  }
}
