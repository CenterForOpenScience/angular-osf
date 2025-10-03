import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PreprintShortInfo } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ListInfoShortenerComponent, SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { DEFAULT_TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';

import { MyPreprintsComponent } from './my-preprints.component';

import { PREPRINT_SHORT_INFO_ARRAY_MOCK } from '@testing/mocks/preprint-short-info.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('MyPreprintsComponent', () => {
  let component: MyPreprintsComponent;
  let fixture: ComponentFixture<MyPreprintsComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;

  const mockPreprints: PreprintShortInfo[] = PREPRINT_SHORT_INFO_ARRAY_MOCK;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    routerMock = RouterMockBuilder.create()
      .withNavigate(jest.fn().mockResolvedValue(true))
      .withNavigateByUrl(jest.fn().mockResolvedValue(true))
      .build();

    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withQueryParams({ page: '1', size: '10', search: '' })
      .build();

    Object.defineProperty(activatedRouteMock, 'queryParams', {
      value: queryParamsSubject.asObservable(),
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [
        MyPreprintsComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, SearchInputComponent, ListInfoShortenerComponent),
        MockPipe(TitleCasePipe),
      ],
      providers: [
        TranslationServiceMock,
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getMyPreprints,
              value: mockPreprints,
            },
            {
              selector: PreprintSelectors.getMyPreprintsTotalCount,
              value: 5,
            },
            {
              selector: PreprintSelectors.areMyPreprintsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.searchControl.value).toBe('');
    expect(component.sortColumn()).toBe('');
    expect(component.sortOrder()).toBe(SortOrder.Desc);
    expect(component.currentPage()).toBe(1);
    expect(component.currentPageSize()).toBe(DEFAULT_TABLE_PARAMS.rows);
  });

  it('should return preprints from store', () => {
    const preprints = component.preprints();
    expect(preprints).toBe(mockPreprints);
  });

  it('should return preprints total count from store', () => {
    const totalCount = component.preprintsTotalCount();
    expect(totalCount).toBe(5);
  });

  it('should return loading state from store', () => {
    const loading = component.areMyPreprintsLoading();
    expect(loading).toBe(false);
  });

  it('should have correct CSS classes', () => {
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
  });

  it('should have skeleton data with correct length', () => {
    expect(component.skeletonData).toHaveLength(10);
    expect(component.skeletonData.every((item) => typeof item === 'object')).toBe(true);
  });

  it('should navigate to preprint details when navigateToPreprintDetails is called', () => {
    const mockPreprint: PreprintShortInfo = {
      id: 'preprint-1',
      title: 'Test Preprint',
      dateModified: '2024-01-01T00:00:00Z',
      contributors: [],
      providerId: 'provider-1',
    };

    component.navigateToPreprintDetails(mockPreprint);

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/preprints/provider-1/preprint-1');
  });

  it('should handle page change correctly', () => {
    const mockEvent = {
      first: 20,
      rows: 10,
    };

    component.onPageChange(mockEvent);

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: { page: '3', size: '10' },
      queryParamsHandling: 'merge',
    });
  });

  it('should handle sort correctly for ascending order', () => {
    const mockEvent = {
      field: 'title',
      order: 1,
    };

    component.onSort(mockEvent);

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: { sortColumn: 'title', sortOrder: 'asc' },
      queryParamsHandling: 'merge',
    });
  });

  it('should handle sort correctly for descending order', () => {
    const mockEvent = {
      field: 'title',
      order: -1,
    };

    component.onSort(mockEvent);

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: { sortColumn: 'title', sortOrder: 'desc' },
      queryParamsHandling: 'merge',
    });
  });

  it('should not navigate when sort field is undefined', () => {
    const mockEvent = {
      field: undefined,
      order: 1,
    };

    component.onSort(mockEvent);

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to add preprint page when addPreprintBtnClicked is called', () => {
    component.addPreprintBtnClicked();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/preprints/select');
  });

  it('should handle search control value changes', () => {
    const testValue = 'test search';
    component.searchControl.setValue(testValue);
    expect(component.searchControl.value).toBe(testValue);
  });

  it('should update component state when query params change', () => {
    queryParamsSubject.next({ page: '2', size: '20', search: 'test' });

    fixture.detectChanges();

    expect(component.currentPage()).toBe(2);
    expect(component.currentPageSize()).toBe(20);
    expect(component.searchControl.value).toBe('test');
  });

  it('should initialize form control correctly', () => {
    expect(component.searchControl).toBeDefined();
    expect(component.searchControl.value).toBe('');
  });

  it('should have correct table parameters', () => {
    const tableParams = component.tableParams();
    expect(tableParams).toEqual({
      ...DEFAULT_TABLE_PARAMS,
      firstRowIndex: 0,
      totalRecords: 5,
    });
  });

  it('should update table parameters when total records change', () => {
    const newTableParams = { totalRecords: 100 };
    component['updateTableParams'](newTableParams);

    const updatedParams = component.tableParams();
    expect(updatedParams.totalRecords).toBe(100);
  });

  it('should create filters correctly', () => {
    const mockParams = {
      page: 1,
      size: 10,
      search: 'test search',
      sortColumn: 'title',
      sortOrder: SortOrder.Desc,
    };

    const filters = component['createFilters'](mockParams);

    expect(filters).toEqual({
      searchValue: 'test search',
      searchFields: ['title', 'tags', 'description'],
      sortColumn: 'title',
      sortOrder: SortOrder.Desc,
    });
  });

  it('should handle empty search value in filters', () => {
    const mockParams = {
      page: 1,
      size: 10,
      search: '',
      sortColumn: 'title',
      sortOrder: SortOrder.Asc,
    };

    const filters = component['createFilters'](mockParams);

    expect(filters.searchValue).toBe('');
  });
});
