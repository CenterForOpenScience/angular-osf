import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ReviewAction } from '@osf/features/moderation/models';
import {
  ClearCollectionModeration,
  CollectionsModerationSelectors,
  GetSubmissionsReviewActions,
} from '@osf/features/moderation/store/collections-moderation';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { SignpostingService } from '@osf/shared/services/signposting.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { AddonsSelectors, ClearConfiguredAddons } from '@osf/shared/stores/addons';
import { GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { ClearCollections, CollectionsSelectors, GetCollectionProvider } from '@osf/shared/stores/collections';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { GetLinkedResources } from '@osf/shared/stores/node-links';
import { ClearWiki } from '@osf/shared/stores/wiki';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';
import { ViewOnlyLinkHelperMock } from '@testing/providers/view-only-link-helper.mock';

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

interface SetupOverrides extends BaseSetupOverrides {
  routerUrl?: string;
  queryParams?: Record<string, string>;
}

describe('ProjectOverviewComponent', () => {
  let component: ProjectOverviewComponent;
  let fixture: ComponentFixture<ProjectOverviewComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastServiceMock: ToastServiceMockType;
  let signpostingServiceMock: {
    addSignposting: Mock;
    removeSignpostingLinkTags: Mock;
  };

  const mockProject = MOCK_PROJECT_OVERVIEW as ProjectOverviewModel;

  const defaultSignals: SignalOverride[] = [
    { selector: CollectionsModerationSelectors.getCollectionSubmissions, value: [] },
    { selector: CollectionsSelectors.getCollectionProvider, value: null },
    { selector: CollectionsModerationSelectors.getCurrentReviewAction, value: null },
    { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
    { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
    { selector: ProjectOverviewSelectors.getProject, value: null },
    { selector: ProjectOverviewSelectors.getProjectLoading, value: false },
    { selector: ProjectOverviewSelectors.isProjectAnonymous, value: false },
    { selector: ProjectOverviewSelectors.hasWriteAccess, value: false },
    { selector: ProjectOverviewSelectors.hasAdminAccess, value: false },
    { selector: ProjectOverviewSelectors.isWikiEnabled, value: false },
    { selector: ProjectOverviewSelectors.getParentProject, value: null },
    { selector: ProjectOverviewSelectors.getParentProjectLoading, value: false },
    { selector: AddonsSelectors.getAddonsResourceReference, value: [] },
    { selector: AddonsSelectors.getConfiguredCitationAddons, value: [] },
    { selector: AddonsSelectors.getOperationInvocation, value: null },
    { selector: ProjectOverviewSelectors.getStorage, value: null },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const routeBuilder = ActivatedRouteMockBuilder.create();
    if (overrides.routeParams) {
      routeBuilder.withParams(overrides.routeParams);
    } else {
      routeBuilder.withParams({ id: 'project-1', collectionId: 'collection-1' });
    }
    if (overrides.queryParams) {
      routeBuilder.withQueryParams(overrides.queryParams);
    }
    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }
    const activatedRouteMock = routeBuilder.build();

    routerMock = RouterMockBuilder.create()
      .withUrl(overrides.routerUrl ?? '/project/project-1')
      .build();

    const decisionClose$ = new Subject<{ action?: string }>();
    customDialogServiceMock = CustomDialogServiceMockBuilder.create()
      .withOpen(
        vi.fn().mockReturnValue({
          onClose: decisionClose$,
          close: vi.fn(),
          destroy: vi.fn(),
        })
      )
      .build();

    toastServiceMock = ToastServiceMock.simple();
    signpostingServiceMock = {
      addSignposting: vi.fn(),
      removeSignpostingLinkTags: vi.fn(),
    };
    const viewOnlyLinkHelperMock = ViewOnlyLinkHelperMock.simple();
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [
        ProjectOverviewComponent,
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
        provideOSFCore(),
        MockProvider(ActivatedRoute, activatedRouteMock),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(SignpostingService, signpostingServiceMock),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyLinkHelperMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return { decisionClose$ };
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch init actions and add signposting on init when project id exists', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectById('project-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetBookmarksCollectionId());
    expect(store.dispatch).toHaveBeenCalledWith(new GetComponents('project-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetLinkedResources('project-1'));
    expect(signpostingServiceMock.addSignposting).toHaveBeenCalledWith('project-1');
  });

  it('should not dispatch init project actions when project id is missing', () => {
    setup({
      hasParent: false,
      routeParams: {},
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetProjectById));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetComponents));
    expect(signpostingServiceMock.addSignposting).not.toHaveBeenCalled();
  });

  it('should dispatch collection provider action in moderation collections route', () => {
    setup({
      routerUrl: '/collections/abc/project/project-1',
      queryParams: { mode: 'moderation' },
      routeParams: { id: 'project-1', collectionId: 'collection-77' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(new GetCollectionProvider('collection-77'));
  });

  it('should dispatch current review action when provider and project are available', () => {
    setup({
      routerUrl: '/collections/abc/project/project-1',
      queryParams: { mode: 'moderation' },
      selectorOverrides: [
        {
          selector: CollectionsSelectors.getCollectionProvider,
          value: { id: 'provider-1', primaryCollection: { id: 'primary-1' } },
        },
        { selector: ProjectOverviewSelectors.getProject, value: mockProject },
      ],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new GetSubmissionsReviewActions('project-1', 'primary-1'));
  });

  it('should open decision dialog and on action show toast and navigate back preserving status', () => {
    const { decisionClose$ } = setup({
      queryParams: { status: 'pending' },
    });
    (routerMock.navigate as Mock).mockClear();

    component.handleOpenMakeDecisionDialog();
    decisionClose$.next({ action: 'accept' });

    expect(customDialogServiceMock.open).toHaveBeenCalled();
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('moderation.makeDecision.acceptSuccess');
    expect(routerMock.navigate).toHaveBeenCalledWith(['../'], {
      relativeTo: expect.any(Object),
      queryParams: { status: 'pending' },
    });
  });

  it('should not show toast or navigate back when decision dialog closes without action', () => {
    const { decisionClose$ } = setup();
    (routerMock.navigate as Mock).mockClear();

    component.handleOpenMakeDecisionDialog();
    decisionClose$.next({});

    expect(toastServiceMock.showSuccess).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back without query params when status is missing', () => {
    setup({
      queryParams: {},
    });

    component.goBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['../'], {
      relativeTo: expect.any(Object),
      queryParams: {},
    });
  });

  it('should remove signposting tags on destroy', () => {
    setup();

    component.ngOnDestroy();

    expect(signpostingServiceMock.removeSignpostingLinkTags).toHaveBeenCalled();
  });

  it('should dispatch cleanup actions when fixture is destroyed', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearProjectOverview());
    expect(store.dispatch).toHaveBeenCalledWith(new ClearWiki());
    expect(store.dispatch).toHaveBeenCalledWith(new ClearCollections());
    expect(store.dispatch).toHaveBeenCalledWith(new ClearCollectionModeration());
    expect(store.dispatch).toHaveBeenCalledWith(new ClearConfiguredAddons());
  });

  it('should compute showDecisionButton correctly for collection route and removable statuses', () => {
    const reviewAction: ReviewAction = {
      id: '1',
      fromState: 'pending',
      toState: 'accepted',
      trigger: 'accept',
      dateModified: '',
      creator: null,
      comment: '',
    };

    setup({
      routerUrl: '/collections/abc/project/project-1',
      selectorOverrides: [{ selector: CollectionsModerationSelectors.getCurrentReviewAction, value: reviewAction }],
    });

    expect(component.showDecisionButton()).toBe(true);
  });
});
