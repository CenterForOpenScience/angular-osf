import { Store } from '@ngxs/store';

import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { Mock } from 'vitest';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ContributorsListShortenerComponent } from '@osf/shared/components/contributors-list-shortener/contributors-list-shortener.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';

import { PREPRINT_SHORT_INFO_ARRAY_MOCK } from '@testing/mocks/preprint-short-info.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { FetchMyPreprints, MyPreprintsSelectors } from '../../store/my-preprints';

import { MyPreprintsComponent } from './my-preprints.component';

describe('MyPreprintsComponent', () => {
  let component: MyPreprintsComponent;
  let fixture: ComponentFixture<MyPreprintsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;

  const mockPreprints = PREPRINT_SHORT_INFO_ARRAY_MOCK;

  beforeEach(() => {
    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    routerMock = RouterMockBuilder.create()
      .withNavigate(vi.fn().mockResolvedValue(true))
      .withNavigateByUrl(vi.fn().mockResolvedValue(true))
      .build();

    const activatedRouteMock = ActivatedRouteMockBuilder.create().build();
    activatedRouteMock.queryParams = queryParamsSubject.asObservable();

    TestBed.configureTestingModule({
      imports: [
        MyPreprintsComponent,
        ...MockComponents(SubHeaderComponent, SearchInputComponent, ContributorsListShortenerComponent),
        MockPipe(TitleCasePipe),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        provideMockStore({
          signals: [
            { selector: MyPreprintsSelectors.getMyPreprints, value: mockPreprints },
            { selector: MyPreprintsSelectors.getMyPreprintsTotalCount, value: 5 },
            { selector: MyPreprintsSelectors.areMyPreprintsLoading, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    vi.spyOn(store, 'dispatch');

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(MyPreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    queryParamsSubject.complete();
  });

  it('should initialize with correct default values', () => {
    expect(component.searchControl.value).toBe('');
    expect(component.sortColumn()).toBe('');
    expect(component.sortOrder()).toBe(SortOrder.Desc);
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
    expect(component.skeletonData).toHaveLength(10);
  });

  it('should dispatch FetchMyPreprints on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      new FetchMyPreprints(1, 10, {
        searchValue: '',
        searchFields: ['title', 'tags', 'description'],
        sortColumn: 'dateModified',
        sortOrder: SortOrder.Desc,
      })
    );
  });

  it('should have correct table parameters after init', () => {
    expect(component.tableParams()).toEqual({
      ...DEFAULT_TABLE_PARAMS,
      firstRowIndex: 0,
      totalRecords: 5,
    });
  });

  it('should navigate to preprint details', () => {
    const mockPreprint = mockPreprints[0];
    component.navigateToPreprintDetails(mockPreprint);

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/preprints/${mockPreprint.providerId}/${mockPreprint.id}`);
  });

  it('should update query params on page change', () => {
    component.onPageChange({ first: 20, rows: 10 });

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: { page: '3', size: '10' },
      queryParamsHandling: 'merge',
    });
  });

  it('should update query params on ascending sort', () => {
    component.onSort({ field: 'title', order: 1 });

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: { sortColumn: 'title', sortOrder: 'asc' },
      queryParamsHandling: 'merge',
    });
  });

  it('should update query params on descending sort', () => {
    component.onSort({ field: 'title', order: -1 });

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: { sortColumn: 'title', sortOrder: 'desc' },
      queryParamsHandling: 'merge',
    });
  });

  it('should not navigate when sort field is undefined', () => {
    component.onSort({ field: undefined, order: 1 });
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to add preprint page', () => {
    component.navigateToAddPreprint();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/preprints/select');
  });

  it('should update state and re-dispatch when query params change', () => {
    (store.dispatch as Mock).mockClear();

    queryParamsSubject.next({
      page: '2',
      size: '20',
      search: 'test',
      sortColumn: 'title',
      sortOrder: 'asc',
    });

    queryParamsSubject.next({ page: '2', size: '20', search: 'test', sortColumn: 'title', sortOrder: 'asc' });
    fixture.detectChanges();

    expect(component.searchControl.value).toBe('test');
    expect(component.sortColumn()).toBe('title');
    expect(component.sortOrder()).toBe(SortOrder.Asc);
    expect(component.tableParams().rows).toBe(20);
    expect(component.tableParams().firstRowIndex).toBe(20);
    expect(store.dispatch).toHaveBeenCalledWith(
      new FetchMyPreprints(2, 20, {
        searchValue: 'test',
        searchFields: ['title', 'tags', 'description'],
        sortColumn: 'title',
        sortOrder: SortOrder.Asc,
      })
    );
  });
});
