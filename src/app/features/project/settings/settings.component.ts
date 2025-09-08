import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { ResourceType, SubscriptionEvent, SubscriptionFrequency } from '@osf/shared/enums';
import { Institution, UpdateNodeRequestModel, ViewOnlyLinkModel } from '@osf/shared/models';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';
import { DeleteViewOnlyLink, FetchViewOnlyLinks, ViewOnlyLinkSelectors } from '@osf/shared/stores';

import {
  ProjectSettingNotificationsComponent,
  SettingsAccessRequestsCardComponent,
  SettingsProjectAffiliationComponent,
  SettingsProjectFormCardComponent,
  SettingsStorageLocationCardComponent,
  SettingsViewOnlyLinksCardComponent,
  SettingsWikiCardComponent,
} from './components';
import { ProjectDetailsModel, ProjectSettingsAttributes, ProjectSettingsData } from './models';
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
  private readonly router = inject(Router);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  readonly projectId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  settings = select(SettingsSelectors.getSettings);
  notifications = select(SettingsSelectors.getNotificationSubscriptions);
  areNotificationsLoading = select(SettingsSelectors.areNotificationsLoading);
  projectDetails = select(SettingsSelectors.getProjectDetails);
  areProjectDetailsLoading = select(SettingsSelectors.areProjectDetailsLoading);
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
  });

  accessRequest = signal(false);
  wikiEnabled = signal(false);
  anyoneCanEditWiki = signal(false);
  anyoneCanComment = signal(false);
  title = signal('');

  constructor() {
    this.setupEffects();
  }

  ngOnInit(): void {
    const id = this.projectId();
    if (id) {
      this.actions.getSettings(id);
      this.actions.getNotifications(id);
      this.actions.getProjectDetails(id);
      this.actions.getViewOnlyLinks(id, ResourceType.Project);
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
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.deleteProject.title',
      messageParams: { name: this.projectDetails().title },
      messageKey: 'project.deleteProject.message',
      onConfirm: () => {
        this.loaderService.show();
        this.actions.deleteProject(this.projectId()).subscribe(() => {
          this.loaderService.hide();
          this.toastService.showSuccess('project.deleteProject.success');
          this.router.navigate(['/']);
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
    const payload: Partial<ProjectSettingsAttributes> = {};

    switch (changedField) {
      case 'access_requests_enabled':
      case 'wiki_enabled':
      case 'anyone_can_edit_wiki':
      case 'anyone_can_comment':
        payload[changedField] = value as boolean;
        break;
    }

    const model = {
      id: this.projectId(),
      type: 'node-settings',
      attributes: { ...payload },
    } as ProjectSettingsData;

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
      const project = this.projectDetails();

      if (project) {
        this.title.set(project.title);
      }
    });
  }
}
