import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of, Subject } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { MyProjectsTableComponent } from '@osf/shared/components/my-projects-table/my-projects-table.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ProjectRedirectDialogService } from '@osf/shared/services/project-redirect-dialog.service';
import { BookmarksSelectors, GetAllMyBookmarks, GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { ClearMyResources, GetMyPreprints, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores/my-resources';

import { MOCK_MY_RESOURCES_ITEM_PROJECT } from '@testing/mocks/my-resources.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import {
  MyProjectsQueryServiceMock,
  MyProjectsQueryServiceMockType,
} from '@testing/providers/my-projects-query.service.mock';
import { MyProjectsTableParamsServiceMock } from '@testing/providers/my-projects-table-params.service.mock';
import {
  ProjectRedirectDialogServiceMock,
  ProjectRedirectDialogServiceMockType,
} from '@testing/providers/project-redirect-dialog.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { CreateProjectDialogComponent } from './components/create-project-dialog/create-project-dialog.component';
import { ProjectDownloadMenuComponent } from './components/project-download-menu/project-download-menu.component';
import { PROJECT_FILTER_OPTIONS } from './constants/project-filter-options.const';
import { VISIBILITY_FILTER_OPTIONS } from './constants/visibility-filter-options.const';
import { MyProjectsQueryService } from './services/my-projects-query.service';
import { MyProjectsTableParamsService } from './services/my-projects-table-params.service';
import { ProjectDownloadOptionsService } from './services/project-download-options.service';
import { MyProjectsTab } from './enums';
import { MyProjectsComponent } from './my-projects.component';

interface SetupOverrides extends BaseSetupOverrides {
  queryModelOverrides?: { search?: string };
  routeQueryParams?: Record<string, string>;
  rawParams?: Record<string, string>;
}

describe('MyProjectsComponent', () => {
  let component: MyProjectsComponent;
  let fixture: ComponentFixture<MyProjectsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogService: CustomDialogServiceMockType;
  let projectRedirectDialogService: ProjectRedirectDialogServiceMockType;
  let queryServiceMock: MyProjectsQueryServiceMockType;

  const defaultSignals: SignalOverride[] = [
    { selector: MyResourcesSelectors.getProjects, value: [MOCK_MY_RESOURCES_ITEM_PROJECT] },
    { selector: MyResourcesSelectors.getRegistrations, value: [] },
    { selector: MyResourcesSelectors.getPreprints, value: [] },
    { selector: MyResourcesSelectors.getTotalProjects, value: 1 },
    { selector: MyResourcesSelectors.getTotalRegistrations, value: 0 },
    { selector: MyResourcesSelectors.getTotalPreprints, value: 0 },
    { selector: BookmarksSelectors.getBookmarks, value: [] },
    { selector: BookmarksSelectors.getBookmarksCollectionId, value: 'bookmark-collection-id' },
    { selector: BookmarksSelectors.getBookmarksTotalCount, value: 0 },
    { selector: UserSelectors.isProjectCreationDisabled, value: false },
  ];

  const defaultRawParams = { tab: '1', page: '1', size: '10' };

  function setup(overrides: SetupOverrides = {}) {
    const routeQueryParams = overrides.routeQueryParams ?? defaultRawParams;
    const rawParams = overrides.rawParams ?? routeQueryParams;

    routerMock = RouterMockBuilder.create().build();
    customDialogService = CustomDialogServiceMock.simple();
    projectRedirectDialogService = ProjectRedirectDialogServiceMock.simple();
    queryServiceMock = MyProjectsQueryServiceMock.create()
      .withRawParams(rawParams)
      .withQueryModel({
        page: Number(rawParams['page'] || 1),
        size: Number(rawParams['size'] || 10),
        search: overrides.queryModelOverrides?.search ?? '',
        sortColumn: '',
        sortOrder: SortOrder.Asc,
      })
      .withSelectedTab(MyProjectsTab.Projects)
      .build();
    const routeMock = ActivatedRouteMockBuilder.create().withQueryParams(routeQueryParams).build();

    TestBed.configureTestingModule({
      imports: [
        MyProjectsComponent,
        ...MockComponents(
          SubHeaderComponent,
          MyProjectsTableComponent,
          ProjectDownloadMenuComponent,
          SearchInputComponent,
          SelectComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(ProjectRedirectDialogService, projectRedirectDialogService),
        MockProvider(MyProjectsQueryService, queryServiceMock),
        MockProvider(MyProjectsTableParamsService, MyProjectsTableParamsServiceMock.simple()),
        MockProvider(ProjectDownloadOptionsService, { clearCache: vi.fn() }),
        MockProvider(IS_MEDIUM, of(false)),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
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

  it('should init, load bookmarks collection id, and show default empty message', () => {
    setup();

    expect(component).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(new GetBookmarksCollectionId());
    expect(component.projectsEmptyMessageKey()).toBe('myProjects.table.emptyState.all.both');
  });

  it('should disable project creation and show tooltip when isProjectCreationDisabled is true', () => {
    setup({ selectorOverrides: [{ selector: UserSelectors.isProjectCreationDisabled, value: true }] });

    expect(component.projectCreationDisabled()).toBe(true);
    expect(component.buttonTooltip()).toBe('myProjects.header.createProjectDisabledTooltip');
  });

  it('should delegate page and sort changes to query service', () => {
    setup();

    component.onPageChange({ first: 20, rows: 10 });
    component.onSort({ field: 'title', order: SortOrder.Desc });
    component.onSort({ order: SortOrder.Asc });

    expect(queryServiceMock.handlePageChange).toHaveBeenCalledWith(20, 10, defaultRawParams, 1);
    expect(queryServiceMock.handleSort).toHaveBeenCalledTimes(1);
    expect(queryServiceMock.handleSort).toHaveBeenCalledWith('title', SortOrder.Desc, defaultRawParams, 1);
  });

  it('should switch tab for numeric values and ignore invalid ones', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onTabChange('not-a-number');
    component.onTabChange(null);
    component.onTabChange(true);

    expect(store.dispatch).not.toHaveBeenCalledWith(new ClearMyResources());
    expect(queryServiceMock.handleTabSwitch).not.toHaveBeenCalled();

    component.onTabChange(String(MyProjectsTab.Registrations));

    expect(store.dispatch).toHaveBeenCalledWith(new ClearMyResources());
    expect(component.selectedTab()).toBe(MyProjectsTab.Registrations);
    expect(component.selectedProjectFilterOption()).toBe(PROJECT_FILTER_OPTIONS[0].value);
    expect(component.selectedVisibilityFilterOption()).toBe(VISIBILITY_FILTER_OPTIONS[0].value);
    expect(queryServiceMock.handleTabSwitch).toHaveBeenCalledWith(defaultRawParams, MyProjectsTab.Registrations);
  });

  it('should open create project dialog and redirect only when project id is returned', () => {
    setup();
    const onClose$ = new Subject<{ project?: { id?: string } }>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$.asObservable()));

    component.createProject();
    onClose$.next({ project: {} });

    expect(customDialogService.open).toHaveBeenCalledWith(CreateProjectDialogComponent, {
      header: 'myProjects.header.createProject',
      width: '850px',
    });
    expect(projectRedirectDialogService.showProjectRedirectDialog).not.toHaveBeenCalled();

    onClose$.next({ project: { id: 'project-123' } });

    expect(projectRedirectDialogService.showProjectRedirectDialog).toHaveBeenCalledWith('project-123');
  });

  it('should navigate to item', () => {
    setup();

    component.navigateToItem(MOCK_MY_RESOURCES_ITEM_PROJECT);

    expect(routerMock.navigate).toHaveBeenCalledWith([MOCK_MY_RESOURCES_ITEM_PROJECT.id]);
  });

  it('should fetch current tab data on filter change and reset page when needed', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onFilterChange();

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetMyProjects(
        1,
        10,
        {
          searchValue: '',
          searchFields: ['title', 'tags', 'description'],
          sortColumn: '',
          sortOrder: SortOrder.Asc,
        },
        PROJECT_FILTER_OPTIONS[0].value,
        VISIBILITY_FILTER_OPTIONS[0].value
      )
    );
    expect(component.isLoading()).toBe(false);

    component.selectedTab.set(MyProjectsTab.Preprints);
    (store.dispatch as Mock).mockClear();
    component.onFilterChange();

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetMyPreprints(1, 10, {
        searchValue: '',
        searchFields: ['title', 'tags'],
        sortColumn: '',
        sortOrder: SortOrder.Asc,
      })
    );
  });

  it('should reset page on filter change when not on first page', () => {
    setup({ rawParams: { tab: '1', page: '3', size: '10' } });
    (store.dispatch as Mock).mockClear();

    component.onFilterChange();

    expect(queryServiceMock.updateParams).toHaveBeenCalledWith(
      { page: 1 },
      { tab: '1', page: '3', size: '10' },
      MyProjectsTab.Projects
    );
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetMyProjects));
  });

  it('should fetch bookmarks only when collection id exists', () => {
    setup();
    component.selectedTab.set(MyProjectsTab.Bookmarks);
    (store.dispatch as Mock).mockClear();

    component.onFilterChange();

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetAllMyBookmarks('bookmark-collection-id', {
        searchValue: '',
        searchFields: ['title', 'tags', 'description'],
        sortColumn: '',
        sortOrder: SortOrder.Asc,
      })
    );
  });

  it('should not fetch bookmarks when collection id is missing', () => {
    setup({ selectorOverrides: [{ selector: BookmarksSelectors.getBookmarksCollectionId, value: null }] });
    component.selectedTab.set(MyProjectsTab.Bookmarks);
    (store.dispatch as Mock).mockClear();

    component.onFilterChange();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetAllMyBookmarks));
    expect(component.isLoading()).toBe(true);
  });

  it('should compute no results message key when search is applied', () => {
    setup({
      queryModelOverrides: { search: 'alpha' },
      routeQueryParams: { tab: '1', page: '1', size: '10', search: 'alpha' },
    });

    expect(component.projectsEmptyMessageKey()).toBe('common.search.noResultsFound');
  });

  it('should delegate search handling after debounce', () => {
    vi.useFakeTimers();
    setup();

    component.searchControl.setValue('alpha');
    vi.advanceTimersByTime(300);

    expect(queryServiceMock.handleSearch).toHaveBeenCalledWith('alpha', defaultRawParams, 1);
  });
});
