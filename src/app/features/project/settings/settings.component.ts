import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { UpdateNodeRequestModel } from '@osf/shared/models/nodes/nodes-json-api.model';
import { ViewOnlyLinkModel } from '@osf/shared/models/view-only-links/view-only-link.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetResource } from '@osf/shared/stores/current-resource';
import { DeleteViewOnlyLink, FetchViewOnlyLinks, ViewOnlyLinkSelectors } from '@osf/shared/stores/view-only-links';

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
import { ProjectDetailsModel, ProjectSettingsAttributesJsonApi, ProjectSettingsDataJsonApi } from './models';
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

@Component({
  selector: 'osf-settings',
  imports: [
    TranslatePipe,
    SubHeaderComponent,
    SettingsProjectFormCardComponent,
    SettingsStorageLocationCardComponent,
    SettingsViewOnlyLinksCardComponent,
    SettingsAccessRequestsCardComponent,
    SettingsWikiCardComponent,
    SettingsProjectAffiliationComponent,
    ProjectSettingNotificationsComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly deleteResourceService = inject(DeleteResourceService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  settings = select(SettingsSelectors.getSettings);
  notifications = select(SettingsSelectors.getNotificationSubscriptions);
  areNotificationsLoading = select(SettingsSelectors.areNotificationsLoading);
  projectDetails = select(SettingsSelectors.getProjectDetails);
  areProjectDetailsLoading = select(SettingsSelectors.areProjectDetailsLoading);
  hasAdminAccess = select(SettingsSelectors.hasAdminAccess);
  hasWriteAccess = select(SettingsSelectors.hasWriteAccess);
  viewOnlyLinks = select(ViewOnlyLinkSelectors.getViewOnlyLinks);
  isViewOnlyLinksLoading = select(ViewOnlyLinkSelectors.isViewOnlyLinksLoading);

  actions = createDispatchMap({
    getSettings: GetProjectSettings,
    getNotifications: GetProjectNotificationSubscriptions,
    getProjectDetails: GetProjectDetails,
    getViewOnlyLinks: FetchViewOnlyLinks,
    updateProjectDetails: UpdateProjectDetails,
    updateProjectSettings: UpdateProjectSettings,
    updateNotificationSubscription: UpdateProjectNotificationSubscription,
    deleteViewOnlyLink: DeleteViewOnlyLink,
    deleteInstitution: DeleteInstitution,
    refreshCurrentResource: GetResource,
  });

  accessRequest = signal(false);
  wikiEnabled = signal(false);
  anyoneCanEditWiki = signal(false);

  constructor() {
    this.setupEffects();
  }

  ngOnInit(): void {
    const id = this.projectId();
    if (id) {
      this.actions.getSettings(id);
      this.actions.getNotifications(id);
      this.actions.getProjectDetails(id);
    }
  }

  submitForm({ title, description }: ProjectDetailsModel): void {
    const current = this.projectDetails();

    if (title === current.title && description === current.description) return;

    const model: UpdateNodeRequestModel = {
      data: {
        type: 'nodes',
        id: this.projectId(),
        attributes: { title, description },
      },
    } as UpdateNodeRequestModel;

    this.loaderService.show();

    this.actions.updateProjectDetails(model).subscribe(() => {
      this.toastService.showSuccess('myProjects.settings.updateProjectDetailsMessage');
      this.loaderService.hide();
    });
  }

  onAccessRequestChange(newValue: boolean): void {
    this.accessRequest.set(newValue);
    this.syncSettingsChanges('access_requests_enabled', newValue);
  }

  onWikiRequestChange(newValue: boolean): void {
    this.wikiEnabled.set(newValue);
    this.syncSettingsChanges('wiki_enabled', newValue);
    this.actions.refreshCurrentResource(this.projectId(), true);
  }

  onAnyoneCanEditWikiRequestChange(newValue: boolean): void {
    this.anyoneCanEditWiki.set(newValue);
    this.syncSettingsChanges('anyone_can_edit_wiki', newValue);
  }

  onNotificationRequestChange(data: { event: SubscriptionEvent; frequency: SubscriptionFrequency }): void {
    const id = `${this.projectId()}_${data.event}`;
    const frequency = data.frequency;

    this.loaderService.show();
    this.actions.updateNotificationSubscription({ id, frequency }).subscribe(() => {
      this.toastService.showSuccess('myProjects.settings.updateProjectSettingsMessage');
      this.loaderService.hide();
    });
  }

  deleteLinkItem(link: ViewOnlyLinkModel): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'myProjects.settings.delete.title',
      headerParams: { name: link.name },
      messageKey: 'myProjects.settings.delete.message',
      onConfirm: () => {
        this.actions.deleteViewOnlyLink(this.projectId(), ResourceType.Project, link.id).subscribe(() => {
          this.toastService.showSuccess('myProjects.settings.viewOnlyLinkDeleted');
          this.loaderService.hide();
        });
      },
    });
  }

  deleteProject(): void {
    const projectId = this.projectId();
    const projectDetails = this.projectDetails();

    if (!projectId) return;

    this.deleteResourceService.deleteProject({
      rootParentId: projectDetails?.rootId || projectId,
      resourceId: projectId,
      destroyRef: this.destroyRef,
      onSuccess: () => this.router.navigate(['/']),
    });
  }

  removeAffiliation(affiliation: Institution): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.deleteInstitution.title',
      messageParams: { name: affiliation.name },
      messageKey: 'project.deleteInstitution.message',
      onConfirm: () => {
        this.loaderService.show();
        this.actions.deleteInstitution(affiliation.id, this.projectId()).subscribe(() => {
          this.loaderService.hide();
          this.toastService.showSuccess('project.deleteInstitution.success');
          this.actions.getProjectDetails(this.projectId());
        });
      },
    });
  }

  private syncSettingsChanges(changedField: string, value: boolean): void {
    const payload: Partial<ProjectSettingsAttributesJsonApi> = {};

    switch (changedField) {
      case 'access_requests_enabled':
      case 'wiki_enabled':
      case 'anyone_can_edit_wiki':
        payload[changedField] = value as boolean;
        break;
    }

    const model = {
      id: this.projectId(),
      type: 'node-settings',
      attributes: { ...payload },
    } as ProjectSettingsDataJsonApi;

    this.loaderService.show();

    this.actions.updateProjectSettings(model).subscribe(() => {
      this.toastService.showSuccess('myProjects.settings.updateProjectSettingsMessage');
      this.loaderService.hide();
    });
  }

  private setupEffects(): void {
    effect(() => {
      const settings = this.settings();

      if (settings?.attributes) {
        this.accessRequest.set(settings.attributes.accessRequestsEnabled);
        this.wikiEnabled.set(settings.attributes.wikiEnabled);
        this.anyoneCanEditWiki.set(settings.attributes.anyoneCanEditWiki);
      }
    });

    effect(() => {
      const id = this.projectId();

      if (id && this.hasAdminAccess()) {
        this.actions.getViewOnlyLinks(id, ResourceType.Project);
      }
    });
  }
}
