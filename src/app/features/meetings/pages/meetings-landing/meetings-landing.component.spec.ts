import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { DEFAULT_TABLE_PARAMS } from '@shared/constants/default-table-params.constants';
import { SortOrder } from '@shared/enums/sort-order.enum';

import { MOCK_MEETING } from '@testing/mocks/meeting.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { MeetingsFeatureCardComponent } from '../../components';
import { GetAllMeetings, MeetingsSelectors } from '../../store';

import { MeetingsLandingComponent } from './meetings-landing.component';

interface SetupOverrides extends BaseSetupOverrides {
  queryParams?: Record<string, string>;
  selectorOverrides?: SignalOverride[];
}

describe('MeetingsLandingComponent', () => {
  let component: MeetingsLandingComponent;
  let fixture: ComponentFixture<MeetingsLandingComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  const defaultSignals: SignalOverride[] = [
    { selector: MeetingsSelectors.getAllMeetings, value: [MOCK_MEETING] },
    { selector: MeetingsSelectors.getMeetingsTotalCount, value: 10 },
    { selector: MeetingsSelectors.isMeetingsLoading, value: false },
  ];

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
      imports: [
        MeetingsLandingComponent,
        ...MockComponents(SubHeaderComponent, SearchInputComponent, MeetingsFeatureCardComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(MeetingsLandingComponent);
    component = fixture.componentInstance;
    if (detectChanges) {
      fixture.detectChanges();
    }
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    setup({ queryParams: { page: '1', size: '10', search: '', sortColumn: 'name', sortOrder: 'asc' } });
    expect(component).toBeTruthy();
  });

  it('should dispatch get meetings from query params effect', () => {
    setup({ queryParams: { page: '2', size: '5', search: 'open', sortColumn: 'name', sortOrder: 'asc' } });

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetAllMeetings(2, 5, {
        searchValue: 'open',
        searchFields: ['name'],
        sortColumn: 'name',
        sortOrder: SortOrder.Asc,
      })
    );
  });

  it('should update current state from query params', () => {
    setup({ queryParams: { page: '3', size: '25', search: 'meeting', sortColumn: 'name', sortOrder: 'asc' } });

    expect(component.currentPage()).toBe(3);
    expect(component.currentPageSize()).toBe(25);
    expect(component.searchControl.value).toBe('meeting');
    expect(component.sortColumn()).toBe('name');
    expect(component.sortOrder()).toBe(SortOrder.Asc);
    expect(component.tableParams().rows).toBe(25);
    expect(component.tableParams().firstRowIndex).toBe(50);
  });

  it('should update total records on table params effect', () => {
    setup({
      selectorOverrides: [{ selector: MeetingsSelectors.getMeetingsTotalCount, value: 42 }],
    });

    expect(component.tableParams().totalRecords).toBe(42);
  });

  it('should navigate to meeting details page', () => {
    setup({}, false);

    component.navigateToMeeting(MOCK_MEETING);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/meetings', MOCK_MEETING.id]);
  });

  it('should navigate with page and size on page change', () => {
    setup({}, false);

    component.onPageChange({ first: 20, rows: 10 } as { first: number; rows: number });

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { page: '3', size: '10' },
      queryParamsHandling: 'merge',
    });
  });

  it('should navigate with sort query params on sort change', () => {
    setup({}, false);

    component.onSort({ field: 'name', order: SortOrder.Desc } as { field: string; order: SortOrder });

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { sortColumn: 'name', sortOrder: 'desc' },
      queryParamsHandling: 'merge',
    });
  });

  it('should not navigate when sort field is missing', () => {
    setup({}, false);

    component.onSort({ field: undefined, order: SortOrder.Asc } as { field?: string; order: SortOrder });

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should update query params from search control after debounce', () => {
    vi.useFakeTimers();
    setup({}, false);
    (mockRouter.navigate as Mock).mockClear();
    vi.advanceTimersByTime(300);
    (mockRouter.navigate as Mock).mockClear();

    component.searchControl.setValue('science');
    vi.advanceTimersByTime(300);

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { search: 'science', page: '1' },
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should initialize table params with defaults', () => {
    setup({}, false);

    expect(component.tableParams().rows).toBe(DEFAULT_TABLE_PARAMS.rows);
    expect(component.tableParams().firstRowIndex).toBe(0);
  });
});
