import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MeetingsState } from '@osf/features/meetings/store';
import { parseQueryFilterParams } from '@osf/shared/helpers';
import { SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { DEFAULT_TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';

import { MeetingsFeatureCardComponent } from '../../components';
import { MEETINGS_FEATURE_CARDS, PARTNER_ORGANIZATIONS } from '../../constants';

import { MeetingsLandingComponent } from './meetings-landing.component';

import { MOCK_MEETING } from '@testing/mocks';

const mockQueryParams = {
  page: 1,
  size: 10,
  search: '',
  sortColumn: 'name',
  sortOrder: SortOrder.Asc,
};

const mockActivatedRoute = {
  queryParams: of(mockQueryParams),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('MeetingsLandingComponent', () => {
  let component: MeetingsLandingComponent;
  let fixture: ComponentFixture<MeetingsLandingComponent>;
  let router: Router;
  const mockMeeting = MOCK_MEETING;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MeetingsLandingComponent,
        ...MockComponents(SubHeaderComponent, SearchInputComponent, MeetingsFeatureCardComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(TranslateService),
        provideStore([MeetingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingsLandingComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create and have correct initial signals', () => {
    expect(component).toBeTruthy();
    expect(component.searchControl).toBeInstanceOf(FormControl);
    expect(component.partnerOrganizations).toEqual(PARTNER_ORGANIZATIONS);
    expect(component.meetingsFeatureCards).toEqual(MEETINGS_FEATURE_CARDS);
    expect(component.skeletonData).toHaveLength(10);
    expect(component.tableParams().rows).toBe(DEFAULT_TABLE_PARAMS.rows);
    expect(component.tableParams().firstRowIndex).toBe(0);
    expect(component.currentPage()).toBe(1);
    expect(component.currentPageSize()).toBe(DEFAULT_TABLE_PARAMS.rows);
    expect(component.sortColumn()).toBe('');
    expect(component.sortOrder()).toBe(SortOrder.Asc);
  });

  it('should navigate to meeting when navigateToMeeting is called', () => {
    component.navigateToMeeting(mockMeeting);
    expect(router.navigate).toHaveBeenCalledWith(['/meetings', '1']);
  });

  describe('router.navigate scenarios', () => {
    const cases = [
      {
        name: 'onPageChange',
        action: (c: MeetingsLandingComponent) => c.onPageChange({ first: 40, rows: 20 }),
        expected: { page: '3', size: '20' },
      },
      {
        name: 'onSort ascending',
        action: (c: MeetingsLandingComponent) => c.onSort({ field: 'location', order: 1 }),
        expected: { sortColumn: 'location', sortOrder: 'asc' },
      },
      {
        name: 'onSort descending',
        action: (c: MeetingsLandingComponent) => c.onSort({ field: 'location', order: -1 }),
        expected: { sortColumn: 'location', sortOrder: 'desc' },
      },
      {
        name: 'onSort with bad params (order=undefined)',
        action: (c: MeetingsLandingComponent) => c.onSort({ field: 'location', order: undefined }),
        expected: { sortColumn: 'location', sortOrder: 'asc' },
      },
    ];
    cases.forEach(({ name, action, expected }) => {
      it(`should call router.navigate with correct params: ${name}`, () => {
        jest.clearAllMocks();
        action(component);
        if (expected) {
          expect(router.navigate).toHaveBeenCalledWith(
            [],
            expect.objectContaining({
              queryParams: expect.objectContaining(expected),
              queryParamsHandling: 'merge',
            })
          );
        } else {
          expect(router.navigate).not.toHaveBeenCalled();
        }
      });
    });
  });

  it('should call router.navigate with correct params on search', () => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    component.searchControl.setValue('test search');
    jest.advanceTimersByTime(450);

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: expect.objectContaining({ search: 'test search', page: '1' }),
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should call router.navigate only once on second input', () => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    component.searchControl.setValue('first');

    jest.advanceTimersByTime(100);

    component.searchControl.setValue('second');

    jest.advanceTimersByTime(350);

    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should not call router.navigate if onSort called with field undefined', () => {
    jest.clearAllMocks();
    component.onSort({ field: undefined, order: 1 });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not update query params when sort field is undefined', () => {
    jest.clearAllMocks();
    component.onSort({ field: undefined, order: 1 });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call router.navigate with only provided queryParams', () => {
    jest.clearAllMocks();
    component.onPageChange({ first: 0, rows: 10 });
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: expect.objectContaining({ page: '1', size: '10' }),
        queryParamsHandling: 'merge',
      })
    );
    jest.clearAllMocks();
    component.onSort({ field: 'name', order: 1 });
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: expect.objectContaining({ sortColumn: 'name', sortOrder: 'asc' }),
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should do nothing when queryParams is undefined', () => {
    const parseQueryFilterParamsSpy = jest.spyOn({ parseQueryFilterParams }, 'parseQueryFilterParams');
    jest.spyOn(component, 'queryParams').mockReturnValue(undefined);

    fixture.detectChanges();

    expect(parseQueryFilterParamsSpy).not.toHaveBeenCalled();

    parseQueryFilterParamsSpy.mockRestore();
  });
});
