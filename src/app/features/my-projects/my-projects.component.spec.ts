import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { BehaviorSubject, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MyProjectsTab } from '@osf/features/my-projects/enums';
import { SortOrder } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { MOCK_STORE } from '@osf/shared/mocks';
import { BookmarksSelectors, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores';
import { MyProjectsTableComponent, SelectComponent, SubHeaderComponent } from '@shared/components';
import { ProjectRedirectDialogService } from '@shared/services';

import { MyProjectsComponent } from './my-projects.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MyProjectsComponent', () => {
  let component: MyProjectsComponent;
  let fixture: ComponentFixture<MyProjectsComponent>;
  let isMediumSubject: BehaviorSubject<boolean>;
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;
  let store: jest.Mocked<Store>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(false);
    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    queryParamsSubject.next({});

    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (
        selector === MyResourcesSelectors.getTotalProjects ||
        selector === MyResourcesSelectors.getTotalRegistrations ||
        selector === MyResourcesSelectors.getTotalPreprints ||
        selector === MyResourcesSelectors.getTotalBookmarks
      )
        return () => 0;
      if (selector === BookmarksSelectors.getBookmarksCollectionId) return () => null;
      if (
        selector === MyResourcesSelectors.getProjects ||
        selector === MyResourcesSelectors.getRegistrations ||
        selector === MyResourcesSelectors.getPreprints ||
        selector === MyResourcesSelectors.getBookmarks
      )
        return () => [];
      return () => undefined;
    });

    await TestBed.configureTestingModule({
      imports: [
        MyProjectsComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, MyProjectsTableComponent, SelectComponent),
      ],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(DialogService, { open: jest.fn() }),
        MockProvider(ConfirmationService, { confirm: jest.fn() }),
        MockProvider(ActivatedRoute, { queryParams: queryParamsSubject.asObservable() }),
        MockProvider(Router, { navigate: jest.fn() }),
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(ProjectRedirectDialogService, { showProjectRedirectDialog: jest.fn() }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    store.dispatch.mockReturnValue(of(undefined));

    (component as any).queryParams = () => ({});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update component state from query params', () => {
    component.updateComponentState({ page: 2, size: 20, search: 'q', sortColumn: 'name', sortOrder: SortOrder.Desc });

    expect(component.currentPage()).toBe(2);
    expect(component.currentPageSize()).toBe(20);
    expect(component.searchControl.value).toBe('q');
    expect(component.sortColumn()).toBe('name');
    expect(component.sortOrder()).toBe(SortOrder.Desc);
    expect(component.tableParams().firstRowIndex).toBe(20);
    expect(component.tableParams().rows).toBe(20);
  });

  it('should create filters depending on tab', () => {
    const filtersProjects = component.createFilters({
      page: 1,
      size: 10,
      search: 's',
      sortColumn: 'name',
      sortOrder: SortOrder.Asc,
    });
    expect(filtersProjects.searchValue).toBe('s');
    expect(filtersProjects.searchFields).toEqual(['title', 'tags', 'description']);

    component.selectedTab.set(MyProjectsTab.Preprints);
    const filtersPreprints = component.createFilters({
      page: 2,
      size: 25,
      search: 's2',
      sortColumn: 'date',
      sortOrder: SortOrder.Desc,
    });
    expect(filtersPreprints.searchFields).toEqual(['title', 'tags']);
  });

  it('should fetch data for projects tab and stop loading', () => {
    jest.clearAllMocks();
    store.dispatch.mockReturnValue(of(undefined));

    component.fetchDataForCurrentTab({ page: 1, size: 10, search: 's', sortColumn: 'name', sortOrder: SortOrder.Asc });

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetMyProjects));
    expect(component.isLoading()).toBe(false);
  });

  it('should handle search and update query params', () => {
    jest.clearAllMocks();
    queryParamsSubject.next({ sortColumn: 'name', sortOrder: 'desc', size: '25' });

    component.handleSearch('query');

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { page: '1', search: 'query', tab: '1' },
    });
  });

  it('should paginate and update query params', () => {
    jest.clearAllMocks();
    queryParamsSubject.next({ sortColumn: 'title', sortOrder: 'asc' });

    component.onPageChange({ first: 30, rows: 15 } as any);

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { page: '3', size: '15', tab: '1' },
    });
  });

  it('should sort and update query params', () => {
    jest.clearAllMocks();

    component.onSort({ field: 'updated', order: SortOrder.Desc } as any);

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { sortColumn: 'updated', sortOrder: 'desc', tab: '1' },
    });
  });

  it('should clear and reset on tab change', () => {
    jest.clearAllMocks();
    queryParamsSubject.next({ size: '50' });

    component.onTabChange(1);

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { page: '1', tab: '1' },
    });

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should navigate to project and set active project', () => {
    const project = { id: 'p1' } as any;
    component.navigateToProject(project);
    expect(component.activeProject()).toEqual(project);
    expect(router.navigate).toHaveBeenCalledWith(['p1']);
  });

  it('should navigate to registry and set active project', () => {
    const reg = { id: 'r1' } as any;
    component.navigateToRegistry(reg);
    expect(component.activeProject()).toEqual(reg);
    expect(router.navigate).toHaveBeenCalledWith(['r1']);
  });
});
