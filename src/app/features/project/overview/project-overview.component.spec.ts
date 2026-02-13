import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideServerRendering } from '@angular/platform-server';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ClearCollectionModeration,
  CollectionsModerationSelectors,
} from '@osf/features/moderation/store/collections-moderation';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { Mode } from '@osf/shared/enums/mode.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { AddonsSelectors, ClearConfiguredAddons } from '@osf/shared/stores/addons';
import { GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { ClearCollections, CollectionsSelectors } from '@osf/shared/stores/collections';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { GetLinkedResources } from '@osf/shared/stores/node-links';
import { ClearWiki } from '@osf/shared/stores/wiki';

import { CitationAddonCardComponent } from './components/citation-addon-card/citation-addon-card.component';
import { FilesWidgetComponent } from './components/files-widget/files-widget.component';
import { LinkedResourcesComponent } from './components/linked-resources/linked-resources.component';
import { OverviewComponentsComponent } from './components/overview-components/overview-components.component';
import { OverviewParentProjectComponent } from './components/overview-parent-project/overview-parent-project.component';
import { OverviewWikiComponent } from './components/overview-wiki/overview-wiki.component';
import { ProjectOverviewMetadataComponent } from './components/project-overview-metadata/project-overview-metadata.component';
import { ProjectOverviewToolbarComponent } from './components/project-overview-toolbar/project-overview-toolbar.component';
import { ProjectRecentActivityComponent } from './components/project-recent-activity/project-recent-activity.component';
import { ProjectOverviewModel } from './models';
import { ProjectOverviewComponent } from './project-overview.component';
import { ClearProjectOverview, GetComponents, GetProjectById, ProjectOverviewSelectors } from './store';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ProjectOverviewComponent', () => {
  let fixture: ComponentFixture<ProjectOverviewComponent>;
  let component: ProjectOverviewComponent;
  let store: jest.Mocked<Store>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastService: jest.Mocked<ToastService>;

  const mockProject: ProjectOverviewModel = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-123',
    title: 'Test Project',
    parentId: 'parent-123',
    rootParentId: 'root-123',
    isPublic: true,
  };

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().withUrl('/test').build();
    activatedRouteMock = ActivatedRouteMockBuilder.create().withParams({ id: 'project-123' }).build();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    toastService = { showSuccess: jest.fn() } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      imports: [
        ProjectOverviewComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          LoadingSpinnerComponent,
          OverviewWikiComponent,
          OverviewComponentsComponent,
          LinkedResourcesComponent,
          ProjectRecentActivityComponent,
          ProjectOverviewToolbarComponent,
          ProjectOverviewMetadataComponent,
          FilesWidgetComponent,
          ViewOnlyLinkMessageComponent,
          OverviewParentProjectComponent,
          CitationAddonCardComponent
        ),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: ProjectOverviewSelectors.getProjectLoading, value: false },
            { selector: ProjectOverviewSelectors.isProjectAnonymous, value: false },
            { selector: ProjectOverviewSelectors.hasWriteAccess, value: true },
            { selector: ProjectOverviewSelectors.hasAdminAccess, value: true },
            { selector: ProjectOverviewSelectors.isWikiEnabled, value: true },
            { selector: ProjectOverviewSelectors.getParentProject, value: null },
            { selector: ProjectOverviewSelectors.getParentProjectLoading, value: false },
            { selector: ProjectOverviewSelectors.getStorage, value: null },
            { selector: ProjectOverviewSelectors.isStorageLoading, value: false },
            { selector: CollectionsModerationSelectors.getCollectionSubmissions, value: [] },
            { selector: CollectionsModerationSelectors.getCurrentReviewAction, value: null },
            { selector: CollectionsModerationSelectors.getCurrentReviewActionLoading, value: false },
            { selector: CollectionsSelectors.getCollectionProvider, value: null },
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: AddonsSelectors.getAddonsResourceReference, value: [] },
            { selector: AddonsSelectors.getConfiguredCitationAddons, value: [] },
            { selector: AddonsSelectors.getOperationInvocation, value: null },
          ],
        }),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastService),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));
    fixture = TestBed.createComponent(ProjectOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch actions when projectId exists in route params', () => {
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetProjectById));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetBookmarksCollectionId));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetComponents));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetLinkedResources));
  });

  it('should dispatch actions when projectId exists in parent route params', () => {
    activatedRouteMock.snapshot!.params = {};
    Object.defineProperty(activatedRouteMock, 'parent', {
      value: { snapshot: { params: { id: 'parent-project-123' } } },
      writable: true,
      configurable: true,
    });

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetProjectById));
  });

  it('should return true for isModerationMode when query param mode is moderation', () => {
    activatedRouteMock.snapshot!.queryParams = { mode: Mode.Moderation };
    fixture.detectChanges();

    expect(component.isModerationMode()).toBe(true);
  });

  it('should return false for isModerationMode when query param mode is not moderation', () => {
    activatedRouteMock.snapshot!.queryParams = { mode: 'other' };
    fixture.detectChanges();

    expect(component.isModerationMode()).toBe(false);
  });

  it('should dispatch cleanup actions on component destroy', () => {
    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearProjectOverview));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearWiki));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearCollections));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearCollectionModeration));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(ClearConfiguredAddons));
  });
});

describe('ProjectOverviewComponent SSR Tests', () => {
  let component: ProjectOverviewComponent;
  let fixture: ComponentFixture<ProjectOverviewComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let store: Store;

  const mockProject: ProjectOverviewModel = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-123',
    title: 'Test Project',
    parentId: 'parent-123',
    rootParentId: 'root-123',
    isPublic: true,
  };

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().withUrl('/projects/project-123').build();
    const parentRoute = {
      params: of({ id: 'project-123' }),
      snapshot: { params: { id: 'project-123' }, queryParams: {} },
    } as any;
    mockActivatedRoute = Object.assign(
      ActivatedRouteMockBuilder.create().withParams({ id: 'project-123' }).withQueryParams({}).build(),
      { parent: parentRoute }
    );

    await TestBed.configureTestingModule({
      imports: [
        ProjectOverviewComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          LoadingSpinnerComponent,
          OverviewWikiComponent,
          OverviewComponentsComponent,
          LinkedResourcesComponent,
          ProjectRecentActivityComponent,
          ProjectOverviewToolbarComponent,
          ProjectOverviewMetadataComponent,
          FilesWidgetComponent,
          ViewOnlyLinkMessageComponent,
          OverviewParentProjectComponent,
          CitationAddonCardComponent
        ),
      ],
      providers: [
        provideServerRendering(),
        { provide: PLATFORM_ID, useValue: 'server' },
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomDialogService, CustomDialogServiceMockBuilder.create().build()),
        MockProvider(ToastService, { showSuccess: jest.fn() }),
        MockProvider(ViewOnlyLinkHelperService, { hasViewOnlyParam: jest.fn().mockReturnValue(false) }),
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: ProjectOverviewSelectors.getProjectLoading, value: false },
            { selector: ProjectOverviewSelectors.isProjectAnonymous, value: false },
            { selector: ProjectOverviewSelectors.hasWriteAccess, value: true },
            { selector: ProjectOverviewSelectors.hasAdminAccess, value: true },
            { selector: ProjectOverviewSelectors.isWikiEnabled, value: true },
            { selector: ProjectOverviewSelectors.getParentProject, value: null },
            { selector: ProjectOverviewSelectors.getParentProjectLoading, value: false },
            { selector: ProjectOverviewSelectors.getStorage, value: null },
            { selector: ProjectOverviewSelectors.isStorageLoading, value: false },
            { selector: CollectionsModerationSelectors.getCollectionSubmissions, value: [] },
            { selector: CollectionsModerationSelectors.getCurrentReviewAction, value: null },
            { selector: CollectionsModerationSelectors.getCurrentReviewActionLoading, value: false },
            { selector: CollectionsSelectors.getCollectionProvider, value: null },
            { selector: CollectionsSelectors.getCollectionProviderLoading, value: false },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: AddonsSelectors.getAddonsResourceReference, value: [] },
            { selector: AddonsSelectors.getConfiguredCitationAddons, value: [] },
            { selector: AddonsSelectors.getOperationInvocation, value: null },
          ],
        }),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectOverviewComponent);
    component = fixture.componentInstance;
    document.head.innerHTML = '';
  });

  it('should render ProjectOverviewComponent server-side without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
    expect(component).toBeTruthy();
  });

  it('should not access browser-only APIs during SSR', () => {
    const platformId = TestBed.inject(PLATFORM_ID);
    expect(platformId).toBe('server');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should execute constructor effects without errors in SSR context', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should add signposting tags during SSR', () => {
    fixture.detectChanges();

    const linkTags = Array.from(document.head.querySelectorAll('link[rel="linkset"]'));
    expect(linkTags.length).toBe(2);
    expect(linkTags[0].getAttribute('href')).toBe('http://localhost:4200/metadata/project-123/?format=linkset');
    expect(linkTags[0].getAttribute('type')).toBe('application/linkset');
    expect(linkTags[1].getAttribute('href')).toBe('http://localhost:4200/metadata/project-123/?format=linkset-json');
    expect(linkTags[1].getAttribute('type')).toBe('application/linkset+json');
  });

  it('should not call browser-only actions in ngOnDestroy during SSR', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    dispatchSpy.mockClear();
    fixture.destroy();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
