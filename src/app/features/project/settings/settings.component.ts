import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { map, of } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ProjectSettingNotificationsComponent,
  SettingsAccessRequestsCardComponent,
  SettingsCommentingCardComponent,
  SettingsProjectFormCardComponent,
  SettingsRedirectLinkComponent,
  SettingsStorageLocationCardComponent,
  SettingsViewOnlyLinksCardComponent,
  SettingsWikiCardComponent,
} from '@osf/features/project/settings/components';
import {
  ProjectDetailsModel,
  ProjectSettingsAttributes,
  ProjectSettingsData,
} from '@osf/features/project/settings/models';
import {
  DeleteProject,
  GetProjectDetails,
  GetProjectSettings,
  SettingsSelectors,
  UpdateProjectDetails,
  UpdateProjectSettings,
} from '@osf/features/project/settings/store';
import {
  GetNotificationSubscriptionsByNodeId,
  NotificationSubscriptionSelectors,
  UpdateNotificationSubscriptionForNodeId,
} from '@osf/features/settings/notifications/store';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';
import { DeleteViewOnlyLink, FetchViewOnlyLinks, ViewOnlyLinkSelectors } from '@osf/shared/stores';
import { CustomValidators } from '@osf/shared/utils';
import { SubHeaderComponent } from '@shared/components';
import { ProjectFormControls, ResourceType, SubscriptionEvent, SubscriptionFrequency } from '@shared/enums';
import { UpdateNodeRequestModel, ViewOnlyLinkModel } from '@shared/models';

@Component({
  selector: 'osf-settings',
  imports: [
    TranslatePipe,
    SubHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    Card,
    Button,
    NgOptimizedImage,
    SettingsProjectFormCardComponent,
    SettingsStorageLocationCardComponent,
    SettingsViewOnlyLinksCardComponent,
    SettingsAccessRequestsCardComponent,
    SettingsWikiCardComponent,
    SettingsCommentingCardComponent,
    SettingsRedirectLinkComponent,
    ProjectSettingNotificationsComponent,
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

  protected settings = select(SettingsSelectors.getSettings);
  protected notifications = select(NotificationSubscriptionSelectors.getNotificationSubscriptionsByNodeId);
  protected projectDetails = select(SettingsSelectors.getProjectDetails);
  protected viewOnlyLinks = select(ViewOnlyLinkSelectors.getViewOnlyLinks);
  protected isViewOnlyLinksLoading = select(ViewOnlyLinkSelectors.isViewOnlyLinksLoading);

  protected actions = createDispatchMap({
    getSettings: GetProjectSettings,
    getNotifications: GetNotificationSubscriptionsByNodeId,
    getProjectDetails: GetProjectDetails,
    getViewOnlyLinks: FetchViewOnlyLinks,
    updateProjectDetails: UpdateProjectDetails,
    updateProjectSettings: UpdateProjectSettings,
    updateNotificationSubscriptionForNodeId: UpdateNotificationSubscriptionForNodeId,
    deleteViewOnlyLink: DeleteViewOnlyLink,
    deleteProject: DeleteProject,
  });

  projectForm = new FormGroup({
    [ProjectFormControls.Title]: new FormControl('', CustomValidators.requiredTrimmed()),
    [ProjectFormControls.Description]: new FormControl(''),
  });

  redirectUrlData = signal<{ url: string; label: string }>({ url: '', label: '' });
  accessRequest = signal(false);
  wikiEnabled = signal(false);
  anyoneCanEditWiki = signal(false);
  anyoneCanComment = signal(false);
  title = signal('');

  affiliations = [];

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
    const current = this.projectDetails().attributes;

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

  onAnyoneCanCommentRequestChange(newValue: boolean): void {
    this.anyoneCanComment.set(newValue);
    this.syncSettingsChanges('anyone_can_comment', newValue);
  }

  onRedirectUrlDataRequestChange(data: { url: string; label: string }): void {
    this.redirectUrlData.set(data);
    this.syncSettingsChanges('redirectUrl', data);
  }

  onNotificationRequestChange(data: { event: SubscriptionEvent; frequency: SubscriptionFrequency }): void {
    const id = `${'n5str'}_${data.event}`;
    const frequency = data.frequency;

    this.loaderService.show();
    this.actions.updateNotificationSubscriptionForNodeId({ id, frequency }).subscribe(() => {
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
          this.toastService.showSuccess('myProjects.settings.delete.success');
          this.loaderService.hide();
        });
      },
    });
  }

  deleteProject(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.deleteProject.title',
      messageParams: { name: this.projectDetails().attributes.title },
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

  private syncSettingsChanges(changedField: string, value: boolean | { url: string; label: string }): void {
    const payload: Partial<ProjectSettingsAttributes> = {};

    switch (changedField) {
      case 'access_requests_enabled':
      case 'wiki_enabled':
      case 'redirect_link_enabled':
      case 'anyone_can_edit_wiki':
      case 'anyone_can_comment':
        payload[changedField] = value as boolean;
        break;
      case 'redirectUrl':
        if (typeof value === 'object') {
          payload['redirect_link_enabled'] = true;
          payload['redirect_link_url'] = value.url ?? null;
          payload['redirect_link_label'] = value.label ?? null;
        }
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
        this.redirectUrlData.set({
          url: settings.attributes.redirectLinkUrl,
          label: settings.attributes.redirectLinkLabel,
        });
      }
    });

    effect(() => {
      const project = this.projectDetails();
      if (project?.attributes) {
        this.projectForm.patchValue({
          [ProjectFormControls.Title]: project.attributes.title,
          [ProjectFormControls.Description]: project.attributes.description,
        });
        this.title.set(project.attributes.title);
      }
    });
  }
}
