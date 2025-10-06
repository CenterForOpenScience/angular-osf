import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType, SubscriptionEvent, SubscriptionFrequency } from '@osf/shared/enums';
import { Institution, UpdateNodeRequestModel, ViewOnlyLinkModel } from '@osf/shared/models';
import { CustomConfirmationService, CustomDialogService, LoaderService, ToastService } from '@osf/shared/services';
import {
  DeleteViewOnlyLink,
  FetchViewOnlyLinks,
  GetResource,
  GetResourceWithChildren,
  ViewOnlyLinkSelectors,
} from '@osf/shared/stores';

import {
  DeleteProjectDialogComponent,
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
  DeleteProject,
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
    FormsModule,
    ReactiveFormsModule,
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
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  currentUser = select(UserSelectors.getCurrentUser);
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
    deleteProject: DeleteProject,
    deleteInstitution: DeleteInstitution,
    refreshCurrentResource: GetResource,
    getComponentsTree: GetResourceWithChildren,
  });

  accessRequest = signal(false);
  wikiEnabled = signal(false);
  anyoneCanEditWiki = signal(false);
  anyoneCanComment = signal(false);

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
    this.loaderService.show();

    this.actions
      .getComponentsTree(this.projectDetails()?.rootId || this.projectId(), this.projectId(), ResourceType.Project)
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.customDialogService.open(DeleteProjectDialogComponent, {
            header: 'project.deleteProject.dialog.deleteProject',
            width: '500px',
          });
        },
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
        this.anyoneCanComment.set(settings.attributes.anyoneCanComment);
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
