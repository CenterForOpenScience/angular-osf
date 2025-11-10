import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  ClearCollectionModeration,
  CollectionsModerationSelectors,
  GetSubmissionsReviewActions,
} from '@osf/features/moderation/store/collections-moderation';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { MakeDecisionDialogComponent } from '@osf/shared/components/make-decision-dialog/make-decision-dialog.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { Mode } from '@osf/shared/enums/mode.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetActivityLogs } from '@osf/shared/stores/activity-logs';
import {
  AddonsSelectors,
  ClearConfiguredAddons,
  GetAddonsResourceReference,
  GetConfiguredCitationAddons,
  GetConfiguredStorageAddons,
} from '@osf/shared/stores/addons';
import { GetBookmarksCollectionId } from '@osf/shared/stores/bookmarks';
import { ClearCollections, CollectionsSelectors, GetCollectionProvider } from '@osf/shared/stores/collections';
import { CurrentResourceSelectors, GetResourceWithChildren } from '@osf/shared/stores/current-resource';
import { GetLinkedResources } from '@osf/shared/stores/node-links';
import { ClearWiki, GetHomeWiki } from '@osf/shared/stores/wiki';
import { AnalyticsService } from '@shared/services/analytics.service';

import { CitationAddonCardComponent } from './components/citation-addon-card/citation-addon-card.component';
import { FilesWidgetComponent } from './components/files-widget/files-widget.component';
import { LinkedResourcesComponent } from './components/linked-resources/linked-resources.component';
import { OverviewComponentsComponent } from './components/overview-components/overview-components.component';
import { OverviewParentProjectComponent } from './components/overview-parent-project/overview-parent-project.component';
import { OverviewWikiComponent } from './components/overview-wiki/overview-wiki.component';
import { ProjectOverviewMetadataComponent } from './components/project-overview-metadata/project-overview-metadata.component';
import { ProjectOverviewToolbarComponent } from './components/project-overview-toolbar/project-overview-toolbar.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { SUBMISSION_REVIEW_STATUS_OPTIONS } from './constants';
import {
  ClearProjectOverview,
  GetComponents,
  GetParentProject,
  GetProjectById,
  GetProjectStorage,
  ProjectOverviewSelectors,
} from './store';

@Component({
  selector: 'osf-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
  imports: [
    Button,
    Message,
    RouterLink,
    TranslatePipe,
    SubHeaderComponent,
    LoadingSpinnerComponent,
    OverviewWikiComponent,
    OverviewComponentsComponent,
    LinkedResourcesComponent,
    RecentActivityComponent,
    ProjectOverviewToolbarComponent,
    ProjectOverviewMetadataComponent,
    FilesWidgetComponent,
    ViewOnlyLinkMessageComponent,
    OverviewParentProjectComponent,
    CitationAddonCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly customDialogService = inject(CustomDialogService);
  readonly analyticsService = inject(AnalyticsService);

  submissions = select(CollectionsModerationSelectors.getCollectionSubmissions);
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  currentReviewAction = select(CollectionsModerationSelectors.getCurrentReviewAction);
  components = select(CurrentResourceSelectors.getResourceWithChildren);
  areComponentsLoading = select(CurrentResourceSelectors.isResourceWithChildrenLoading);
  currentProject = select(ProjectOverviewSelectors.getProject);
  isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);
  isAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  hasWriteAccess = select(ProjectOverviewSelectors.hasWriteAccess);
  hasAdminAccess = select(ProjectOverviewSelectors.hasAdminAccess);
  isWikiEnabled = select(ProjectOverviewSelectors.isWikiEnabled);
  parentProject = select(ProjectOverviewSelectors.getParentProject);
  isParentProjectLoading = select(ProjectOverviewSelectors.getParentProjectLoading);
  addonsResourceReference = select(AddonsSelectors.getAddonsResourceReference);
  configuredCitationAddons = select(AddonsSelectors.getConfiguredCitationAddons);
  operationInvocation = select(AddonsSelectors.getOperationInvocation);
  storage = select(ProjectOverviewSelectors.getStorage);

  private readonly actions = createDispatchMap({
    getProject: GetProjectById,
    getProjectStorage: GetProjectStorage,
    getBookmarksId: GetBookmarksCollectionId,
    getHomeWiki: GetHomeWiki,
    getComponents: GetComponents,
    getLinkedProjects: GetLinkedResources,
    getActivityLogs: GetActivityLogs,
    getCollectionProvider: GetCollectionProvider,
    getCurrentReviewAction: GetSubmissionsReviewActions,

    clearProjectOverview: ClearProjectOverview,
    clearWiki: ClearWiki,
    clearCollections: ClearCollections,
    clearCollectionModeration: ClearCollectionModeration,
    clearConfiguredAddons: ClearConfiguredAddons,

    getComponentsTree: GetResourceWithChildren,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    getParentProject: GetParentProject,
    getAddonsResourceReference: GetAddonsResourceReference,
    getConfiguredCitationAddons: GetConfiguredCitationAddons,
  });

  readonly activityPageSize = 5;
  readonly activityDefaultPage = 1;
  readonly SubmissionReviewStatusOptions = SUBMISSION_REVIEW_STATUS_OPTIONS;

  readonly isCollectionsRoute = computed(() => this.router.url.includes('/collections'));

  readonly isModerationMode = computed(() => {
    const mode = this.route.snapshot.queryParams['mode'];

    return mode === Mode.Moderation;
  });

  submissionReviewStatus = computed(() => this.currentReviewAction()?.toState);

  showDecisionButton = computed(
    () =>
      this.isCollectionsRoute() &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Removed &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Rejected
  );

  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  filesRootOption = computed(() => ({
    value: this.currentProject()?.id ?? '',
    label: this.currentProject()?.title ?? '',
  }));

  constructor() {
    this.setupCollectionsEffects();
    this.setupProjectEffects();
    this.setupAddonsEffects();
    this.setupCleanup();
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id'];

    if (projectId) {
      this.actions.getProject(projectId);
      this.actions.getProjectStorage(projectId);
      this.actions.getBookmarksId();
      this.actions.getComponents(projectId);
      this.actions.getLinkedProjects(projectId);
      this.actions.getActivityLogs(projectId, this.activityDefaultPage, this.activityPageSize);
    }
  }

  handleOpenMakeDecisionDialog() {
    this.customDialogService
      .open(MakeDecisionDialogComponent, {
        header: 'moderation.makeDecision.header',
        width: '600px',
      })
      .onClose.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data?.action) {
          this.toastService.showSuccess(`moderation.makeDecision.${data.action}Success`);
          this.goBack();
        }
      });
  }

  goBack(): void {
    const currentStatus = this.route.snapshot.queryParams['status'];
    const queryParams = currentStatus ? { status: currentStatus } : {};

    this.router.navigate(['../'], { relativeTo: this.route, queryParams });
  }

  private setupCollectionsEffects(): void {
    effect(() => {
      if (this.isModerationMode() && this.isCollectionsRoute()) {
        const collectionId = this.route.snapshot.params['collectionId'];

        this.actions.getCollectionProvider(collectionId);
      }
    });

    effect(() => {
      if (this.isModerationMode() && this.isCollectionsRoute()) {
        const provider = this.collectionProvider();
        const resource = this.currentProject();

        if (!provider || !resource) return;

        this.actions.getCurrentReviewAction(resource.id, provider.primaryCollection.id);
      }
    });
  }

  private setupProjectEffects(): void {
    effect(() => {
      const currentProject = this.currentProject();

      if (currentProject) {
        const rootParentId = currentProject.rootParentId ?? currentProject.id;
        this.actions.getComponentsTree(rootParentId, currentProject.id, ResourceType.Project);
        const parentProjectId = currentProject.parentId;

        if (parentProjectId) {
          this.actions.getParentProject(parentProjectId);
        }
      }
    });

    effect(() => {
      const project = this.currentProject();

      if (project && this.isWikiEnabled()) {
        this.actions.getHomeWiki(ResourceType.Project, project.id);
      }
    });
  }

  private setupAddonsEffects(): void {
    effect(() => {
      const currentProject = this.currentProject();

      if (currentProject) {
        this.actions.getAddonsResourceReference(currentProject.id);
      }
    });

    effect(() => {
      const resourceReference = this.addonsResourceReference();

      if (resourceReference.length) {
        this.actions.getConfiguredCitationAddons(resourceReference[0].id);
      }
    });
  }

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearProjectOverview();
      this.actions.clearWiki();
      this.actions.clearCollections();
      this.actions.clearCollectionModeration();
      this.actions.clearConfiguredAddons();
    });
  }
}
