import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { CreateProjectDialogComponent } from '@osf/features/my-projects/components';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { MyProjectsTableComponent } from '@osf/shared/components/my-projects-table/my-projects-table.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ProjectRedirectDialogService } from '@osf/shared/services/project-redirect-dialog.service';
import { ClearMyResources, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores/my-resources';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogService: CustomDialogServiceMockType;
  let projectRedirectDialogService: { showProjectRedirectDialog: Mock };

  const defaultSignals: SignalOverride[] = [
    { selector: MyResourcesSelectors.getProjects, value: [] },
    { selector: MyResourcesSelectors.getTotalProjects, value: 0 },
    { selector: MyResourcesSelectors.getProjectsLoading, value: false },
  ];

  interface SetupOverrides extends BaseSetupOverrides {
    platformId?: 'browser' | 'server';
    routeQueryParams?: Record<string, unknown>;
  }

  function setup(options: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create().build();
    customDialogService = CustomDialogServiceMock.simple();
    projectRedirectDialogService = { showProjectRedirectDialog: vi.fn() };
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
          IconComponent,
          LoadingSpinnerComponent,
          ScheduledBannerComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(ProjectRedirectDialogService, projectRedirectDialogService),
        MockProvider(PLATFORM_ID, options?.platformId ?? 'browser'),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, options.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
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

  it('should update query params on page change', () => {
    setup();
    (routerMock.navigate as Mock).mockClear();

    component.onPageChange({ first: 20, rows: 10 } as never);

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

    component.onSort({ field: 'dateModified', order: -1 } as never);

    expect(component.sortColumn()).toBe('dateModified');
    expect(component.sortOrder()).toBe(-1);
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: {
        page: 1,
        rows: 10,
        search: undefined,
        sortField: 'dateModified',
        sortOrder: -1,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should create filters from current search and sort state', () => {
    setup({
      selectorOverrides: [
        {
          selector: MyResourcesSelectors.getProjects,
          value: [
            { id: '1', title: 'Alpha project' },
            { id: '2', title: 'Beta project' },
          ],
        },
      ],
    });

    component.searchControl.setValue('alp');
    component.sortColumn.set('title');
    component.sortOrder.set(-1);

    expect(component.createFilters()).toEqual({
      searchValue: 'alp',
      searchFields: ['title'],
      sortColumn: 'title',
      sortOrder: -1,
    });
  });

  it('should open create project dialog and redirect on close result', () => {
    setup();
    const onClose$ = new Subject<{ project: { id: string } }>();
    customDialogService.open.mockReturnValue({ onClose: onClose$.asObservable() } as unknown as DynamicDialogRef);

    component.createProject();
    onClose$.next({ project: { id: 'p1' } });

    expect(customDialogService.open).toHaveBeenCalledWith(CreateProjectDialogComponent, {
      header: 'myProjects.header.createProject',
      width: '850px',
    });
    expect(projectRedirectDialogService.showProjectRedirectDialog).toHaveBeenCalledWith('p1');
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
});
