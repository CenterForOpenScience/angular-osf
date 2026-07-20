import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of, Subject } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MyProjectsTableComponent } from '@osf/shared/components/my-projects-table/my-projects-table.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ProjectRedirectDialogService } from '@osf/shared/services/project-redirect-dialog.service';
import { BookmarksSelectors, GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { ClearMyResources, MyResourcesSelectors } from '@osf/shared/stores/my-resources';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import {
  MyProjectsQueryServiceMock,
  MyProjectsQueryServiceMockType,
} from '@testing/providers/my-projects-query.service.mock';
import {
  MyProjectsTableParamsServiceMock,
  MyProjectsTableParamsServiceMockType,
} from '@testing/providers/my-projects-table-params.service.mock';
import {
  ProjectRedirectDialogServiceMock,
  ProjectRedirectDialogServiceMockType,
} from '@testing/providers/project-redirect-dialog.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

import { CreateProjectDialogComponent } from './components/create-project-dialog/create-project-dialog.component';
import { PROJECT_FILTER_OPTIONS } from './constants/project-filter-options.const';
import { VISIBILITY_FILTER_OPTIONS } from './constants/visibility-filter-options.const';
import { MyProjectsQueryService } from './services/my-projects-query.service';
import { MyProjectsTableParamsService } from './services/my-projects-table-params.service';
import { MyProjectsTab } from './enums';
import { MyProjectsComponent } from './my-projects.component';

describe('MyProjectsComponent', () => {
  let component: MyProjectsComponent;
  let fixture: ComponentFixture<MyProjectsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogService: CustomDialogServiceMockType;
  let projectRedirectDialogService: ProjectRedirectDialogServiceMockType;
  let queryServiceMock: MyProjectsQueryServiceMockType;
  let tableParamsServiceMock: MyProjectsTableParamsServiceMockType;

  const projectItem = {
    id: 'p1',
    type: 'nodes',
    title: 'Project 1',
    dateCreated: '2024-01-01',
    dateModified: '2024-01-02',
    isPublic: true,
    contributors: [],
  };

  const defaultSignals: SignalOverride[] = [
    { selector: MyResourcesSelectors.getProjects, value: [projectItem] },
    { selector: MyResourcesSelectors.getRegistrations, value: [] },
    { selector: MyResourcesSelectors.getPreprints, value: [] },
    { selector: MyResourcesSelectors.getTotalProjects, value: 1 },
    { selector: MyResourcesSelectors.getTotalRegistrations, value: 0 },
    { selector: MyResourcesSelectors.getTotalPreprints, value: 0 },
    { selector: BookmarksSelectors.getBookmarks, value: [] },
    { selector: BookmarksSelectors.getBookmarksCollectionId, value: 'bookmark-collection-id' },
    { selector: BookmarksSelectors.getBookmarksTotalCount, value: 0 },
  ];

  function setup(
    selectorOverrides?: SignalOverride[],
    queryModelOverrides?: { search?: string },
    routeQueryParams: Record<string, string> = { tab: '1', page: '1', size: '10' }
  ) {
    routerMock = RouterMockBuilder.create().build();
    customDialogService = CustomDialogServiceMock.simple();
    projectRedirectDialogService = ProjectRedirectDialogServiceMock.simple();
    queryServiceMock = MyProjectsQueryServiceMock.create()
      .withRawParams({ tab: '1', page: '1', size: '10' })
      .withQueryModel({
        page: 1,
        size: 10,
        search: queryModelOverrides?.search ?? '',
        sortColumn: '',
        sortOrder: SortOrder.Asc,
      })
      .withSelectedTab(MyProjectsTab.Projects)
      .build();
    tableParamsServiceMock = MyProjectsTableParamsServiceMock.simple();
    const routeMock = ActivatedRouteMockBuilder.create().withQueryParams(routeQueryParams).build();

    TestBed.configureTestingModule({
      imports: [
        MyProjectsComponent,
        ...MockComponents(SubHeaderComponent, MyProjectsTableComponent, SearchInputComponent, SelectComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(ProjectRedirectDialogService, projectRedirectDialogService),
        MockProvider(MyProjectsQueryService, queryServiceMock),
        MockProvider(MyProjectsTableParamsService, tableParamsServiceMock),
        MockProvider(IS_MEDIUM, of(false)),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(MyProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should dispatch get bookmarks collection id on init', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new GetBookmarksCollectionId());
  });

  it('should delegate page changes to query service', () => {
    setup();
    component.onPageChange({ first: 20, rows: 10 } as { first: number; rows: number });

    expect(queryServiceMock.handlePageChange).toHaveBeenCalledWith(20, 10, { tab: '1', page: '1', size: '10' }, 1);
  });

  it('should delegate sort changes when field exists', () => {
    setup();
    component.onSort({ field: 'title', order: SortOrder.Desc } as { field: string; order: SortOrder });

    expect(queryServiceMock.handleSort).toHaveBeenCalledWith(
      'title',
      SortOrder.Desc,
      { tab: '1', page: '1', size: '10' },
      1
    );
  });

  it('should not delegate sort when field is missing', () => {
    setup();
    component.onSort({ field: undefined, order: SortOrder.Asc } as { field?: string; order: SortOrder });

    expect(queryServiceMock.handleSort).not.toHaveBeenCalled();
  });

  it('should clear and switch tab when onTabChange receives numeric value', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onTabChange(String(MyProjectsTab.Registrations));

    expect(store.dispatch).toHaveBeenCalledWith(new ClearMyResources());
    expect(component.selectedTab()).toBe(MyProjectsTab.Registrations);
    expect(component.selectedProjectFilterOption()).toBe(PROJECT_FILTER_OPTIONS[0].value);
    expect(component.selectedVisibilityFilterOption()).toBe(VISIBILITY_FILTER_OPTIONS[0].value);
    expect(queryServiceMock.handleTabSwitch).toHaveBeenCalledWith(
      { tab: '1', page: '1', size: '10' },
      MyProjectsTab.Registrations
    );
  });

  it('should ignore invalid tab values', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onTabChange('not-a-number');

    expect(store.dispatch).not.toHaveBeenCalledWith(new ClearMyResources());
    expect(queryServiceMock.handleTabSwitch).not.toHaveBeenCalled();
  });

  it('should open create project dialog and redirect after close result', () => {
    setup();
    const onClose$ = new Subject<{ project: { id: string } }>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$.asObservable()));

    component.createProject();
    onClose$.next({ project: { id: 'project-123' } });

    expect(customDialogService.open).toHaveBeenCalledWith(CreateProjectDialogComponent, {
      header: 'myProjects.header.createProject',
      width: '850px',
    });
    expect(projectRedirectDialogService.showProjectRedirectDialog).toHaveBeenCalledWith('project-123');
  });

  it('should navigate to project and set active project', () => {
    setup();

    component.navigateToProject(projectItem);

    expect(component.activeProject()).toEqual(projectItem);
    expect(routerMock.navigate).toHaveBeenCalledWith([projectItem.id]);
  });

  it('should navigate to registry and set active project', () => {
    setup();

    component.navigateToRegistry(projectItem);

    expect(component.activeProject()).toEqual(projectItem);
    expect(routerMock.navigate).toHaveBeenCalledWith([projectItem.id]);
  });

  it('should fetch projects on project filter change', () => {
    setup();
    const getMyProjectsSpy = vi.spyOn(component.actions, 'getMyProjects').mockReturnValue(of(void 0));

    component.onProjectFilterChange();

    expect(getMyProjectsSpy).toHaveBeenCalledWith(
      1,
      10,
      {
        searchValue: '',
        searchFields: ['title', 'tags', 'description'],
        sortColumn: '',
        sortOrder: SortOrder.Asc,
      },
      PROJECT_FILTER_OPTIONS[0].value,
      undefined,
      VISIBILITY_FILTER_OPTIONS[0].value
    );
    expect(component.isLoading()).toBe(false);
  });

  it('should fetch projects on visibility filter change', () => {
    setup();
    const getMyProjectsSpy = vi.spyOn(component.actions, 'getMyProjects').mockReturnValue(of(void 0));

    component.onVisibilityFilterChange();

    expect(getMyProjectsSpy).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('should fetch preprints with preprint search fields', () => {
    setup();
    component.selectedTab.set(MyProjectsTab.Preprints);
    const getMyPreprintsSpy = vi.spyOn(component.actions, 'getMyPreprints').mockReturnValue(of(void 0));

    component.onProjectFilterChange();

    expect(getMyPreprintsSpy).toHaveBeenCalledWith(1, 10, {
      searchValue: '',
      searchFields: ['title', 'tags'],
      sortColumn: '',
      sortOrder: SortOrder.Asc,
    });
  });

  it('should fetch bookmarks when collection id exists', () => {
    setup();
    component.selectedTab.set(MyProjectsTab.Bookmarks);
    const getBookmarksSpy = vi.spyOn(component.actions, 'getMyBookmarks').mockReturnValue(of(void 0));

    component.onProjectFilterChange();

    expect(getBookmarksSpy).toHaveBeenCalledWith('bookmark-collection-id', {
      searchValue: '',
      searchFields: ['title', 'tags', 'description'],
      sortColumn: '',
      sortOrder: SortOrder.Asc,
    });
  });

  it('should not fetch bookmarks when collection id is missing', () => {
    setup([{ selector: BookmarksSelectors.getBookmarksCollectionId, value: null }]);
    component.selectedTab.set(MyProjectsTab.Bookmarks);
    const getBookmarksSpy = vi.spyOn(component.actions, 'getMyBookmarks').mockReturnValue(of(void 0));

    component.onProjectFilterChange();

    expect(getBookmarksSpy).not.toHaveBeenCalled();
    expect(component.isLoading()).toBe(true);
  });

  it('should compute no results message key when search is applied', () => {
    setup(undefined, { search: 'alpha' }, { tab: '1', page: '1', size: '10', search: 'alpha' });

    expect(component.projectsEmptyMessageKey()).toBe('common.search.noResultsFound');
  });

  it('should compute empty state message key when search is empty', () => {
    setup();

    expect(component.projectsEmptyMessageKey()).toBe('myProjects.table.emptyState.all.both');
  });

  it('should not redirect when create project dialog closes without project id', () => {
    setup();
    const onClose$ = new Subject<{ project?: { id?: string } }>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$.asObservable()));

    component.createProject();
    onClose$.next({ project: {} });

    expect(projectRedirectDialogService.showProjectRedirectDialog).not.toHaveBeenCalled();
  });

  it('should delegate search handling after debounce', () => {
    vi.useFakeTimers();
    setup();

    component.searchControl.setValue('alpha');
    vi.advanceTimersByTime(300);

    expect(queryServiceMock.handleSearch).toHaveBeenCalledWith('alpha', { tab: '1', page: '1', size: '10' }, 1);
  });
});
