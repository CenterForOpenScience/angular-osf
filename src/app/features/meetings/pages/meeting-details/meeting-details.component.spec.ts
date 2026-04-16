import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';

import { MOCK_MEETING, MOCK_MEETING_SUBMISSIONS } from '@testing/mocks/meeting.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { MEETING_SUBMISSIONS_TABLE_PARAMS } from '../../constants';
import { Meeting, MeetingSubmission } from '../../models';
import { GetMeetingById, GetMeetingSubmissions, MeetingsSelectors } from '../../store';

import { MeetingDetailsComponent } from './meeting-details.component';

interface SetupOverrides extends BaseSetupOverrides {
  queryParams?: Record<string, string>;
  selectorOverrides?: SignalOverride[];
  selectorSnapshotOverrides?: {
    selector: unknown;
    value: unknown;
  }[];
}

describe('MeetingDetailsComponent', () => {
  let component: MeetingDetailsComponent;
  let fixture: ComponentFixture<MeetingDetailsComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  const meetingByIdFn = (meeting: Meeting | undefined) => (meetingId: string) =>
    meeting && meeting.id === meetingId ? meeting : undefined;

  const defaultSignals: SignalOverride[] = [
    { selector: MeetingsSelectors.getMeetingById, value: meetingByIdFn(MOCK_MEETING) },
    { selector: MeetingsSelectors.getAllMeetingSubmissions, value: MOCK_MEETING_SUBMISSIONS },
    { selector: MeetingsSelectors.getMeetingSubmissionsTotalCount, value: 10 },
    { selector: MeetingsSelectors.isMeetingSubmissionsLoading, value: false },
  ];

  const defaultSnapshotSelectors = [{ selector: MeetingsSelectors.getMeetingById, value: meetingByIdFn(MOCK_MEETING) }];

  function setup(overrides: SetupOverrides = {}, detectChanges = true) {
    const routeBuilder = ActivatedRouteMockBuilder.create();
    if (overrides.routeParams) {
      routeBuilder.withParams(overrides.routeParams);
    }
    if (overrides.queryParams) {
      routeBuilder.withQueryParams(overrides.queryParams);
    }
    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }
    const mockRoute = routeBuilder.build();
    mockRouter = RouterMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [MeetingDetailsComponent, ...MockComponents(SubHeaderComponent, SearchInputComponent)],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        MockProvider(ActivatedRoute, mockRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          selectors: [...defaultSnapshotSelectors, ...(overrides.selectorSnapshotOverrides ?? [])],
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(MeetingDetailsComponent);
    component = fixture.componentInstance;
    if (detectChanges) {
      fixture.detectChanges();
    }
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    setup({
      routeParams: { id: MOCK_MEETING.id },
      queryParams: { page: '1', size: '10', search: '', sortColumn: 'title', sortOrder: 'asc' },
    });
    expect(component).toBeTruthy();
  });

  it('should dispatch meeting submissions action from query params effect', () => {
    setup({
      routeParams: { id: MOCK_MEETING.id },
      queryParams: { page: '2', size: '5', search: 'biology', sortColumn: 'title', sortOrder: 'asc' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetMeetingSubmissions(MOCK_MEETING.id, 2, 5, {
        searchValue: 'biology',
        searchFields: ['title', 'author_name', 'meeting_category'],
        sortColumn: 'title',
        sortOrder: SortOrder.Asc,
      })
    );
  });

  it('should dispatch get meeting by id when meeting is not in store', () => {
    setup({
      routeParams: { id: MOCK_MEETING.id },
      selectorOverrides: [{ selector: MeetingsSelectors.getMeetingById, value: meetingByIdFn(undefined) }],
      selectorSnapshotOverrides: [{ selector: MeetingsSelectors.getMeetingById, value: meetingByIdFn(undefined) }],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new GetMeetingById(MOCK_MEETING.id));
  });

  it('should navigate with page and size on page change', () => {
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);

    component.onPageChange({ first: 20, rows: 10 } as { first: number; rows: number });

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { page: '3', size: '10' },
      queryParamsHandling: 'merge',
    });
  });

  it('should navigate with sort query params on sort change', () => {
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);

    component.onSort({ field: 'title', order: SortOrder.Desc } as { field: string; order: SortOrder });

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { sortColumn: 'title', sortOrder: 'desc' },
      queryParamsHandling: 'merge',
    });
  });

  it('should not navigate on sort when field is missing', () => {
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);

    component.onSort({ field: undefined, order: SortOrder.Asc } as { field?: string; order: SortOrder });

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should update query params from search control after debounce', () => {
    vi.useFakeTimers();
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);
    (mockRouter.navigate as Mock).mockClear();
    vi.advanceTimersByTime(300);
    (mockRouter.navigate as Mock).mockClear();

    component.searchControl.setValue('open science');
    vi.advanceTimersByTime(300);

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { search: 'open science', page: '1' },
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should open submission download link in new tab', () => {
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);
    const stopPropagation = vi.fn();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.downloadSubmission({ stopPropagation } as unknown as Event, MOCK_MEETING_SUBMISSIONS[0]);

    expect(stopPropagation).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(MOCK_MEETING_SUBMISSIONS[0].downloadLink, '_blank');
  });

  it('should not open new tab when submission has no download link', () => {
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);
    const stopPropagation = vi.fn();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const meetingSubmission: MeetingSubmission = { ...MOCK_MEETING_SUBMISSIONS[1], downloadLink: null };

    component.downloadSubmission({ stopPropagation } as unknown as Event, meetingSubmission);

    expect(stopPropagation).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should expose expected default table params', () => {
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);

    expect(component.tableParams().rows).toBe(MEETING_SUBMISSIONS_TABLE_PARAMS.rows);
    expect(component.tableParams().firstRowIndex).toBe(0);
  });

  it('should build page description from meeting dates and location', () => {
    setup({ routeParams: { id: MOCK_MEETING.id } }, false);

    expect(component.pageDescription()).toContain('New York | Jan 15, 2024');
    expect(component.pageDescription()).toContain('- Jan 16, 2024');
  });
});
