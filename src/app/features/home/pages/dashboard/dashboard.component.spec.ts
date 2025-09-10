import { MockComponents, MockProvider } from 'ng-mocks';

import { TablePageEvent } from 'primeng/table';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MyResourcesSelectors } from '@osf/shared/stores';
import { IconComponent, MyProjectsTableComponent, SubHeaderComponent } from '@shared/components';
import { IS_MEDIUM } from '@shared/helpers';
import { MyResourcesItem } from '@shared/models';

import { DashboardComponent } from './dashboard.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { RouterMock, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let routerMock: RouterMockType;

  beforeEach(async () => {
    routerMock = RouterMock.create().build();

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        ...MockComponents(SubHeaderComponent, MyProjectsTableComponent, IconComponent),
        OSFTestingModule,
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: MyResourcesSelectors.getProjects, value: [] },
            { selector: MyResourcesSelectors.getTotalProjects, value: 0 },
            { selector: MyResourcesSelectors.getProjectsLoading, value: false },
          ],
        }),
        MockProvider(Router, routerMock),
        MockProvider(IS_MEDIUM, of(false)),
        MockProvider(ActivatedRoute, ActivatedRouteMock.withQueryParams({}).build()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to project on navigateToProject', () => {
    const navigateSpy = routerMock.navigate as jest.Mock;
    component.navigateToProject({ id: 'p1', title: 'T' } as MyResourcesItem);
    expect(navigateSpy).toHaveBeenCalledWith(['p1']);
  });

  it('should open create project dialog with width 95vw when not medium', () => {
    const dialogOpenSpy = jest.spyOn((component as any).dialogService, 'open');
    component.createProject();
    expect(dialogOpenSpy).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ width: '95vw' }));
  });

  it('should update query params on page change', () => {
    const navigateSpy = routerMock.navigate as jest.Mock;
    component.onPageChange({ first: 20, rows: 10 } as TablePageEvent);
    expect(navigateSpy).toHaveBeenCalledWith([], expect.objectContaining({ queryParamsHandling: 'merge' }));
  });

  it('should update query params on sort', () => {
    const navigateSpy = routerMock.navigate as jest.Mock;
    component.onSort({ field: 'title', order: -1 });
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('updateQueryParams should send expected query params (isSearch=false)', () => {
    const navigateSpy = routerMock.navigate as jest.Mock;

    component.tableParams.update((c) => ({ ...c, rows: 10, firstRowIndex: 20 }));
    component.sortColumn.set('title');
    component.sortOrder.set(-1);
    component.searchControl.setValue('hello');

    component.updateQueryParams(false);

    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParamsHandling: 'merge',
        queryParams: expect.objectContaining({
          page: 3,
          rows: 10,
          search: 'hello',
          sortField: 'title',
          sortOrder: -1,
        }),
      })
    );
  });

  it('updateQueryParams should reset page to 1 when isSearch=true', () => {
    const navigateSpy = routerMock.navigate as jest.Mock;

    component.tableParams.update((c) => ({ ...c, rows: 25, firstRowIndex: 50 }));
    component.updateQueryParams(true);

    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: expect.objectContaining({ page: 1, rows: 25 }) })
    );
  });

  it('createFilters should map control and sort signals', () => {
    component.searchControl.setValue('query');
    component.sortColumn.set('title');
    component.sortOrder.set(-1);

    const filters = component.createFilters();
    expect(filters).toEqual({
      searchValue: 'query',
      searchFields: ['title'],
      sortColumn: 'title',
      sortOrder: -1,
    });
  });

  it('fetchProjects should dispatch getMyProjects with computed page and filters', () => {
    (component as any).actions = { ...component['actions'], getMyProjects: jest.fn() };

    component.tableParams.update((c) => ({ ...c, rows: 15, firstRowIndex: 30 }));

    const mockFilters = { searchValue: '', searchFields: [], sortColumn: undefined, sortOrder: 1 };
    const filtersSpy = jest.spyOn(component, 'createFilters').mockReturnValue(mockFilters);

    component.fetchProjects();

    expect(filtersSpy).toHaveBeenCalled();
    expect((component as any).actions.getMyProjects).toHaveBeenCalledWith(3, 15, mockFilters);
  });

  it('setupTotalRecordsEffect should update totalRecords from selector value', () => {
    expect(component.tableParams().totalRecords).toBe(0);
  });

  it('setupQueryParamsSubscription should parse params and call fetchProjects', () => {
    const fetchSpy = jest.spyOn(component, 'fetchProjects');

    const routeMock = ActivatedRouteMock.withQueryParams({
      page: 2,
      rows: 5,
      sortField: 'title',
      sortOrder: -1,
      search: 'abc',
    }).build();

    (component as any).route = routeMock as any;

    component.setupQueryParamsSubscription();

    expect(component.tableParams().firstRowIndex).toBe(5);
    expect(component.tableParams().rows).toBe(5);
    expect(component.sortColumn()).toBe('title');
    expect(component.sortOrder()).toBe(-1);
    expect(component.searchControl.value).toBe('abc');
    expect(fetchSpy).toHaveBeenCalled();
  });
});
