import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { SortEvent } from 'primeng/api';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';

import { debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

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
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SearchInputComponent, SubHeaderComponent } from '@osf/shared/components';
import { SortOrder } from '@osf/shared/enums';
import { parseQueryFilterParams } from '@osf/shared/helpers';
import { QueryParams, SearchFilters, TableParameters } from '@osf/shared/models';

import { MEETING_SUBMISSIONS_TABLE_PARAMS } from '../../constants';
import { MeetingSubmission } from '../../models';
import { GetMeetingById, GetMeetingSubmissions, MeetingsSelectors } from '../../store';

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

  searchControl = new FormControl<string>('');

  queryParams = toSignal(this.route.queryParams);
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
  skeletonData: MeetingSubmission[] = Array.from({ length: 10 }, () => ({}) as MeetingSubmission);

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
        sortOrder: event.order as SortOrder,
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
      this.searchControl.setValue(params.search);
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
