import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { UserSelectors } from '@osf/core/store/user';
import { CreateProjectDialogComponent } from '@osf/features/my-projects/components/create-project-dialog/create-project-dialog.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { MyProjectsTableComponent } from '@osf/shared/components/my-projects-table/my-projects-table.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { FEATURE_FLAGS } from '@osf/shared/constants/feature-flags.const';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ProjectRedirectDialogService } from '@osf/shared/services/project-redirect-dialog.service';
import { ClearMyResources, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores/my-resources';

import {
  MOCK_MY_RESOURCES_ITEM_PROJECT,
  MOCK_MY_RESOURCES_ITEM_PROJECT_PRIVATE,
} from '@testing/mocks/my-resources.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
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

import { WorkflowLauncherSectionComponent } from '../../components/workflow-launcher-section/workflow-launcher-section.component';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogService: CustomDialogServiceMockType;
  let projectRedirectDialogService: ProjectRedirectDialogServiceMockType;

  const projectItem = MOCK_MY_RESOURCES_ITEM_PROJECT;
  const secondProjectItem = MOCK_MY_RESOURCES_ITEM_PROJECT_PRIVATE;

  const defaultSignals: SignalOverride[] = [
    { selector: MyResourcesSelectors.getProjects, value: [] },
    { selector: MyResourcesSelectors.getTotalProjects, value: 0 },
    { selector: MyResourcesSelectors.getProjectsLoading, value: false },
    { selector: UserSelectors.isProjectCreationDisabled, value: false },
    { selector: UserSelectors.getActiveFlags, value: [] },
  ];

  interface SetupOverrides extends BaseSetupOverrides {
    platformId?: 'browser' | 'server';
    routeQueryParams?: Record<string, unknown>;
  }

  function setup(options: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create().build();
    customDialogService = CustomDialogServiceMock.simple();
    projectRedirectDialogService = ProjectRedirectDialogServiceMock.simple();
    const routeMock = ActivatedRouteMockBuilder.create()
      .withQueryParams(options.routeQueryParams ?? {})
      .build();

    TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        ...MockComponents(
          SubHeaderComponent,
          MyProjectsTableComponent,
          SearchInputComponent,
          LoadingSpinnerComponent,
          ScheduledBannerComponent,
          WorkflowLauncherSectionComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(ProjectRedirectDialogService, projectRedirectDialogService),
        MockProvider(PLATFORM_ID, options.platformId ?? 'browser'),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, options.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create and fetch projects with default params on init', () => {
    setup();

    expect(component).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(
      new GetMyProjects(1, 10, {
        searchValue: '',
        searchFields: ['title'],
        sortColumn: undefined,
        sortOrder: SortOrder.Asc,
      })
    );
  });

  it('should read query params and fetch projects on init', () => {
    setup({
      routeQueryParams: {
        page: '2',
        rows: '25',
        sortField: 'title',
        sortOrder: '1',
        search: 'abc',
      },
    });

    expect(component.tableParams().firstRowIndex).toBe(25);
    expect(component.tableParams().rows).toBe(25);
    expect(component.sortColumn()).toBe('title');
    expect(component.sortOrder()).toBe(SortOrder.Asc);
    expect(component.searchControl.value).toBe('abc');
    expect(store.dispatch).toHaveBeenCalledWith(
      new GetMyProjects(2, 25, {
        searchValue: 'abc',
        searchFields: ['title'],
        sortColumn: 'title',
        sortOrder: SortOrder.Asc,
      })
    );
  });

  it('should default sort order when query param sort order is invalid', () => {
    setup({
      routeQueryParams: {
        sortField: 'title',
        sortOrder: 'invalid',
      },
    });

    expect(component.sortOrder()).toBe(SortOrder.Asc);
  });

  it('should sync total projects count into table params', () => {
    setup({ selectorOverrides: [{ selector: MyResourcesSelectors.getTotalProjects, value: 42 }] });

    expect(component.tableParams().totalRecords).toBe(42);
  });

  it('should disable project creation messaging when isProjectCreationDisabled is true', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.isProjectCreationDisabled, value: true }],
    });

    expect(component.buttonTooltip()).toBe('home.loggedIn.dashboard.createProjectDisabledTooltip');
    expect(component.noProjectsMessage()).toBe('home.loggedIn.dashboard.noCreatedProjectAndCreateProjectDisabled');
  });

  it('should update query params on page change', () => {
    setup();
    (routerMock.navigate as Mock).mockClear();

    component.onPageChange({ first: 20, rows: 10 } as TablePageEvent);

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: {
        page: 3,
        rows: 10,
        search: undefined,
        sortField: undefined,
        sortOrder: 1,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should update sort and reset page in query params on sort', () => {
    setup();
    (routerMock.navigate as Mock).mockClear();

    component.onSort({ field: 'dateModified', order: SortOrder.Desc } as SortEvent);

    expect(component.sortColumn()).toBe('dateModified');
    expect(component.sortOrder()).toBe(SortOrder.Desc);
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: {
        page: 1,
        rows: 10,
        search: undefined,
        sortField: 'dateModified',
        sortOrder: SortOrder.Desc,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should not update query params on sort when field is missing', () => {
    setup();
    (routerMock.navigate as Mock).mockClear();

    component.onSort({ field: undefined, order: SortOrder.Desc } as SortEvent);

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should update query params after search debounce', () => {
    vi.useFakeTimers();
    setup();
    (routerMock.navigate as Mock).mockClear();

    component.searchControl.setValue('alpha');
    vi.advanceTimersByTime(300);

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: {
        page: 1,
        rows: 10,
        search: 'alpha',
        sortField: undefined,
        sortOrder: 1,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should not update query params when debounced search value is unchanged', () => {
    vi.useFakeTimers();
    setup();
    component.searchControl.setValue('alpha');
    vi.advanceTimersByTime(300);
    (routerMock.navigate as Mock).mockClear();

    component.searchControl.setValue('alpha');
    vi.advanceTimersByTime(300);

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should omit empty search from query params', () => {
    setup();
    (routerMock.navigate as Mock).mockClear();

    component.searchControl.setValue('');
    component.updateQueryParams();

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: {
        page: 1,
        rows: 10,
        search: undefined,
        sortField: undefined,
        sortOrder: 1,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should filter projects by search value case insensitively', () => {
    setup({
      routeQueryParams: { search: 'PRIVATE' },
      selectorOverrides: [
        {
          selector: MyResourcesSelectors.getProjects,
          value: [projectItem, secondProjectItem],
        },
      ],
    });

    expect(component.filteredProjects()).toEqual([secondProjectItem]);
  });

  it('should return all projects when search is empty', () => {
    setup({
      selectorOverrides: [{ selector: MyResourcesSelectors.getProjects, value: [projectItem, secondProjectItem] }],
    });

    expect(component.filteredProjects()).toEqual([projectItem, secondProjectItem]);
  });

  it('should navigate to project and set active project', () => {
    setup();

    component.navigateToProject(projectItem);

    expect(component.activeProject()).toEqual(projectItem);
    expect(routerMock.navigate).toHaveBeenCalledWith([projectItem.id]);
  });

  it('should open create project dialog and redirect on close result', () => {
    setup();
    const onClose$ = new Subject<{ project: { id: string } }>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$.asObservable()));

    component.createProject();
    onClose$.next({ project: { id: 'p1' } });

    expect(customDialogService.open).toHaveBeenCalledWith(CreateProjectDialogComponent, {
      header: 'myProjects.header.createProject',
      width: '850px',
    });
    expect(projectRedirectDialogService.showProjectRedirectDialog).toHaveBeenCalledWith('p1');
  });

  it('should not redirect when create project dialog closes without project id', () => {
    setup();
    const onClose$ = new Subject<{ project?: { id?: string } } | null>();
    customDialogService.open.mockReturnValue(CustomDialogServiceMock.dialogRefWithClose(onClose$.asObservable()));

    component.createProject();
    onClose$.next(null);
    expect(projectRedirectDialogService.showProjectRedirectDialog).not.toHaveBeenCalled();

    onClose$.next({ project: {} });
    expect(projectRedirectDialogService.showProjectRedirectDialog).not.toHaveBeenCalled();
  });

  it('should open help link in new tab', () => {
    setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.openInfoLink();

    expect(openSpy).toHaveBeenCalledWith('https://help.osf.io/', '_blank');
  });

  it('should clear my resources on destroy in browser', () => {
    setup({ platformId: 'browser' });
    (store.dispatch as Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearMyResources());
  });

  it('should not clear my resources on destroy on server', () => {
    setup({ platformId: 'server' });
    (store.dispatch as Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).not.toHaveBeenCalledWith(new ClearMyResources());
  });

  it('should show loading spinner while projects are loading', () => {
    setup({ selectorOverrides: [{ selector: MyResourcesSelectors.getProjectsLoading, value: true }] });

    expect(fixture.nativeElement.querySelector('osf-loading-spinner')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('osf-sub-header')).toBeFalsy();
  });

  it('should enable workflow launcher when feature flag is active', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getActiveFlags, value: [FEATURE_FLAGS.WORKFLOW_LAUNCHER] }],
    });

    expect(component.isWorkflowLauncherEnabled()).toBe(true);
    expect(fixture.nativeElement.querySelector('osf-workflow-launcher-section')).toBeTruthy();
  });

  it('should hide workflow launcher when feature flag is inactive', () => {
    setup();

    expect(component.isWorkflowLauncherEnabled()).toBe(false);
    expect(fixture.nativeElement.querySelector('osf-workflow-launcher-section')).toBeFalsy();
  });

  it('should use welcome state when no projects and no search', () => {
    setup();

    expect(component.existsProjects()).toBe(false);
    expect(component.subHeaderTitle()).toBe('home.loggedIn.dashboard.welcome');
    expect(component.noProjectsMessage()).toBe('home.loggedIn.dashboard.noCreatedProject');
    expect(fixture.nativeElement.querySelector('osf-my-projects-table')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.latest-research-container')).toBeFalsy();
  });

  it('should treat search value as existing projects when list is empty', () => {
    setup({ routeQueryParams: { search: 'query' } });

    expect(component.existsProjects()).toBeTruthy();
    expect(component.subHeaderTitle()).toBe('home.loggedIn.dashboard.title');
  });

  it('should show projects table when projects exist', () => {
    setup({
      selectorOverrides: [{ selector: MyResourcesSelectors.getProjects, value: [projectItem] }],
    });

    expect(component.existsProjects()).toBeTruthy();
    expect(component.subHeaderTitle()).toBe('home.loggedIn.dashboard.title');
    expect(fixture.nativeElement.querySelector('osf-my-projects-table')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.latest-research-container')).toBeTruthy();
  });
});
