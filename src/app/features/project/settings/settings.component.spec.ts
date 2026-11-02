import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetResource } from '@osf/shared/stores/current-resource';
import { DeleteViewOnlyLink, FetchViewOnlyLinks, ViewOnlyLinkSelectors } from '@osf/shared/stores/view-only-links';

import { MOCK_NODE_DETAILS } from '@testing/mocks/node-details.mock';
import { MOCK_VIEW_ONLY_LINK } from '@testing/mocks/view-only-link.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import {
  DeleteResourceServiceMock,
  DeleteResourceServiceMockType,
} from '@testing/providers/delete-resource-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { DeleteResourceService } from './services/delete-resource.service';
import {
  ProjectSettingNotificationsComponent,
  SettingsAccessRequestsCardComponent,
  SettingsProjectAffiliationComponent,
  SettingsProjectFormCardComponent,
  SettingsStorageLocationCardComponent,
  SettingsViewOnlyLinksCardComponent,
  SettingsWikiCardComponent,
} from './components';
import { NodeDetailsModel, ProjectSettingsDataJsonApi } from './models';
import { SettingsComponent } from './settings.component';
import {
  DeleteInstitution,
  GetProjectDetails,
  GetProjectNotificationSubscriptions,
  GetProjectSettings,
  SettingsSelectors,
  UpdateProjectDetails,
  UpdateProjectNotificationSubscription,
  UpdateProjectSettings,
} from './store';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let toastService: ToastServiceMockType;
  let customConfirmationService: CustomConfirmationServiceMockType;
  let deleteResourceService: DeleteResourceServiceMockType;

  const projectId = 'test-project-123';
  const projectDetails: NodeDetailsModel = {
    ...MOCK_NODE_DETAILS,
    id: projectId,
    rootId: 'root-1',
  };
  const settings = {
    attributes: {
      accessRequestsEnabled: true,
      wikiEnabled: false,
      anyoneCanEditWiki: false,
    },
  };

  const defaultSignals: SignalOverride[] = [
    { selector: SettingsSelectors.getSettings, value: settings },
    { selector: SettingsSelectors.getNotificationSubscriptions, value: [] },
    { selector: SettingsSelectors.areNotificationsLoading, value: false },
    { selector: SettingsSelectors.getProjectDetails, value: projectDetails },
    { selector: SettingsSelectors.areProjectDetailsLoading, value: false },
    { selector: SettingsSelectors.hasAdminAccess, value: true },
    { selector: SettingsSelectors.hasWriteAccess, value: true },
    { selector: ViewOnlyLinkSelectors.getViewOnlyLinks, value: [] },
    { selector: ViewOnlyLinkSelectors.isViewOnlyLinksLoading, value: false },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { id: projectId });

    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }

    routerMock = RouterMockBuilder.create().build();
    toastService = ToastServiceMock.simple();
    customConfirmationService = CustomConfirmationServiceMock.simple();
    deleteResourceService = DeleteResourceServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        SettingsComponent,
        ...MockComponents(
          SubHeaderComponent,
          SettingsProjectFormCardComponent,
          SettingsStorageLocationCardComponent,
          SettingsViewOnlyLinksCardComponent,
          SettingsAccessRequestsCardComponent,
          SettingsWikiCardComponent,
          SettingsProjectAffiliationComponent,
          ProjectSettingNotificationsComponent,
          LoadingSpinnerComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeBuilder.build()),
        MockProvider(Router, routerMock),
        MockProvider(CustomConfirmationService, customConfirmationService),
        MockProvider(DeleteResourceService, deleteResourceService),
        MockProvider(LoaderService, new LoaderServiceMock()),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should load project settings from the parent route', () => {
    setup();

    expect(component.projectId()).toBe(projectId);
    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectSettings(projectId));
    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectNotificationSubscriptions(projectId));
    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectDetails(projectId));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchViewOnlyLinks(projectId, ResourceType.Project));
  });

  it('should not load project settings when the route has no parent', () => {
    setup({ hasParent: false });

    expect(component.projectId()).toBeUndefined();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetProjectSettings));
  });

  it('should apply saved settings', () => {
    setup();

    expect(component.accessRequest()).toBe(true);
    expect(component.wikiEnabled()).toBe(false);
    expect(component.anyoneCanEditWiki()).toBe(false);
  });

  it('should update access requests', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onAccessRequestChange(false);

    expect(component.accessRequest()).toBe(false);
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateProjectSettings({
        id: projectId,
        type: 'node-settings',
        attributes: { access_requests_enabled: false },
      } as ProjectSettingsDataJsonApi)
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('myProjects.settings.updateProjectSettingsMessage');
  });

  it('should refresh the current resource when wiki access changes', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onWikiRequestChange(true);

    expect(store.dispatch).toHaveBeenCalledWith(new GetResource(projectId, true));
  });

  it('should not update project details when they are unchanged', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.submitForm({ title: projectDetails.title, description: projectDetails.description });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should update project details when they change', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.submitForm({ title: 'New Title', description: 'New Description' });

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateProjectDetails({
        data: {
          type: 'nodes',
          id: projectId,
          attributes: { title: 'New Title', description: 'New Description' },
        },
      } as UpdateProjectDetails['payload'])
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('myProjects.settings.updateProjectDetailsMessage');
  });

  it('should delete a view-only link after confirmation', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.deleteLinkItem(MOCK_VIEW_ONLY_LINK);
    customConfirmationService.confirmDelete.mock.calls[0][0].onConfirm();

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'myProjects.settings.delete.title',
        headerParams: { name: MOCK_VIEW_ONLY_LINK.name },
        messageKey: 'myProjects.settings.delete.message',
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      new DeleteViewOnlyLink(projectId, ResourceType.Project, MOCK_VIEW_ONLY_LINK.id)
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('myProjects.settings.viewOnlyLinkDeleted');
  });

  it('should delete the project and navigate home on success', () => {
    setup();

    component.deleteProject();
    deleteResourceService.deleteProject.mock.calls[0][0].onSuccess();

    expect(deleteResourceService.deleteProject).toHaveBeenCalledWith(
      expect.objectContaining({
        rootParentId: 'root-1',
        resourceId: projectId,
      })
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not delete the project when the route has no parent', () => {
    setup({ hasParent: false });

    component.deleteProject();

    expect(deleteResourceService.deleteProject).not.toHaveBeenCalled();
  });

  it('should update a notification subscription', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onNotificationRequestChange({
      event: SubscriptionEvent.FileUpdated,
      frequency: SubscriptionFrequency.Daily,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateProjectNotificationSubscription({
        id: `${projectId}_${SubscriptionEvent.FileUpdated}`,
        frequency: SubscriptionFrequency.Daily,
      })
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('myProjects.settings.updateProjectSettingsMessage');
  });

  it('should remove an affiliation after confirmation', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    const affiliation = { id: 'inst-1', name: 'Center' } as Institution;

    component.removeAffiliation(affiliation);
    customConfirmationService.confirmDelete.mock.calls[0][0].onConfirm();

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'project.deleteInstitution.title',
        messageKey: 'project.deleteInstitution.message',
        messageParams: { name: 'Center' },
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteInstitution('inst-1', projectId));
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.deleteInstitution.success');
  });
});
