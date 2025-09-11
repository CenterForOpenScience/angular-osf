import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { TablePageEvent } from 'primeng/table';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MyResourcesItem } from '@osf/shared/models';
import { LoadingSpinnerComponent, MyProjectsTableComponent, SubHeaderComponent } from '@shared/components';
import { MyResourcesSelectors } from '@shared/stores';

import { DashboardComponent } from './dashboard.component';

import { getProjectsMockForComponent } from '@testing/data/dashboard/dasboard.data';
import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { ActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { RouterMockType } from '@testing/providers/router-provider.mock';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let routerMock: RouterMockType;

  let projectsSignal: WritableSignal<any[]>;
  let totalProjectsSignal: WritableSignal<number>;
  let areProjectsLoadingSignal: WritableSignal<boolean>;

  beforeEach(async () => {
    projectsSignal = signal(getProjectsMockForComponent());
    totalProjectsSignal = signal(getProjectsMockForComponent().length);
    areProjectsLoadingSignal = signal(false);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, MyProjectsTableComponent, LoadingSpinnerComponent),
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            selectSignal: (selector: any) => {
              if (selector === MyResourcesSelectors.getProjects) return projectsSignal;
              if (selector === MyResourcesSelectors.getTotalProjects) return totalProjectsSignal;
              if (selector === MyResourcesSelectors.getProjectsLoading) return areProjectsLoadingSignal;
              return signal(null);
            },
            dispatch: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should show loading s pinner when projects are loading', () => {
    areProjectsLoadingSignal.set(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.directive(LoadingSpinnerComponent));
    expect(spinner).toBeTruthy();
  });

  it('should render projects table when projects exist', () => {
    projectsSignal.set(getProjectsMockForComponent());
    totalProjectsSignal.set(getProjectsMockForComponent().length);
    areProjectsLoadingSignal.set(false);
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(MyProjectsTableComponent));
    expect(table).toBeTruthy();
  });

  it('should render welcome video when no projects exist', () => {
    projectsSignal.set([]);
    totalProjectsSignal.set(0);
    areProjectsLoadingSignal.set(false);
    fixture.detectChanges();
    const iframe = fixture.debugElement.query(By.css('iframe'));
    expect(iframe).toBeTruthy();
    expect(iframe.nativeElement.src).toContain('youtube.com');
  });

  it('should render welcome screen when no projects exist', () => {
    projectsSignal.set([]);
    totalProjectsSignal.set(0);
    areProjectsLoadingSignal.set(false);
    fixture.detectChanges();

    const welcomeText = fixture.debugElement.nativeElement.textContent;
    expect(welcomeText).toContain('home.loggedIn.dashboard.noCreatedProject');
  });

  it('should open OSF help link in new tab when openInfoLink is called', () => {
    const spy = jest.spyOn(window, 'open').mockImplementation(() => null);
    component.openInfoLink();
    expect(spy).toHaveBeenCalledWith('https://help.osf.io/', '_blank');
  });

  it('should render product images after loading spinner disappears', () => {
    areProjectsLoadingSignal.set(true);
    fixture.detectChanges();

    let productImages = fixture.debugElement
      .queryAll(By.css('img'))
      .filter((img) => img.nativeElement.getAttribute('src')?.includes('assets/images/dashboard/products/'));

    expect(productImages.length).toBe(0);

    const spinner = fixture.debugElement.query(By.css('osf-loading-spinner'));
    expect(spinner).toBeTruthy();

    areProjectsLoadingSignal.set(false);
    fixture.detectChanges();

    productImages = fixture.debugElement
      .queryAll(By.css('img'))
      .filter((img) => img.nativeElement.getAttribute('src')?.includes('assets/images/dashboard/products/'));

    expect(productImages.length).toBe(4);

    const sources = productImages.map((img) => img.nativeElement.getAttribute('src'));

    expect(sources).toEqual(
      expect.arrayContaining([
        'assets/images/dashboard/products/osf-collections.png',
        'assets/images/dashboard/products/osf-institutions.png',
        'assets/images/dashboard/products/osf-registries.png',
        'assets/images/dashboard/products/osf-preprints.png',
      ])
    );
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
