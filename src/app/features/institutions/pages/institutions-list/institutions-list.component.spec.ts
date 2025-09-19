import { MockProvider } from 'ng-mocks';

import { PaginatorState } from 'primeng/paginator';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { MOCK_INSTITUTION } from '@shared/mocks/institution.mock';

import { InstitutionsListComponent } from './institutions-list.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Institutions List', () => {
  let component: InstitutionsListComponent;
  let fixture: ComponentFixture<InstitutionsListComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockInstitutions = [MOCK_INSTITUTION];
  const mockTotalCount = 2;

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withQueryParams({ page: '1', size: '10', search: '' })
      .build();

    await TestBed.configureTestingModule({
      imports: [InstitutionsListComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getInstitutions, value: mockInstitutions },
            { selector: InstitutionsSelectors.getInstitutionsTotalCount, value: mockTotalCount },
            { selector: InstitutionsSelectors.isInstitutionsLoading, value: false },
          ],
        }),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentPage, first, and call updateQueryParams when page is provided', () => {
    const paginatorEvent: PaginatorState = {
      page: 1,
      first: 20,
      rows: 10,
      pageCount: 5,
    };

    component.onPageChange(paginatorEvent);

    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(20);
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: {
        page: '2',
        size: '10',
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should set currentPage to 1 when page is not provided', () => {
    const paginatorEvent: PaginatorState = {
      page: undefined,
      first: 0,
      rows: 20,
      pageCount: 3,
    };

    component.onPageChange(paginatorEvent);

    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: {
        page: '1',
        size: '20',
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should handle first being undefined', () => {
    const paginatorEvent: PaginatorState = {
      page: 2,
      first: undefined,
      rows: 15,
      pageCount: 4,
    };

    component.onPageChange(paginatorEvent);

    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(0);
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.any(Object),
      queryParams: {
        page: '2',
        size: '15',
      },
      queryParamsHandling: 'merge',
    });
  });
});
