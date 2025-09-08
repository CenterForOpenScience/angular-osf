import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { TagModule } from 'primeng/tag';

import { CommonModule } from '@angular/common';
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
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  ClearCollectionModeration,
  CollectionsModerationSelectors,
  GetSubmissionsReviewActions,
} from '@osf/features/moderation/store/collections-moderation';
import { Mode, ResourceType, UserPermissions } from '@osf/shared/enums';
import { hasViewOnlyParam, IS_XSMALL } from '@osf/shared/helpers';
import { MapProjectOverview } from '@osf/shared/mappers';
import { ToastService } from '@osf/shared/services';
import {
  ClearCollections,
  ClearWiki,
  CollectionsSelectors,
  GetBookmarksCollectionId,
  GetCollectionProvider,
  GetHomeWiki,
  GetLinkedResources,
} from '@osf/shared/stores';
import { GetActivityLogs } from '@osf/shared/stores/activity-logs';
import {
  LoadingSpinnerComponent,
  MakeDecisionDialogComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@shared/components';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import {
  LinkedResourcesComponent,
  OverviewComponentsComponent,
  OverviewToolbarComponent,
  OverviewWikiComponent,
  RecentActivityComponent,
} from './components';
import {
  ClearProjectOverview,
  GetComponents,
  GetProjectById,
  ProjectOverviewSelectors,
  SetProjectCustomCitation,
} from './store';

@Component({
  selector: 'osf-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    SubHeaderComponent,
    FormsModule,
    LoadingSpinnerComponent,
    OverviewWikiComponent,
    OverviewComponentsComponent,
    LinkedResourcesComponent,
    RecentActivityComponent,
    OverviewToolbarComponent,
    ResourceMetadataComponent,
    TranslatePipe,
    Message,
    RouterLink,
    ViewOnlyLinkMessageComponent,
    ViewOnlyLinkMessageComponent,
  ],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly dataciteService = inject(DataciteService);

  isMobile = toSignal(inject(IS_XSMALL));
  submissions = select(CollectionsModerationSelectors.getCollectionSubmissions);
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  currentReviewAction = select(CollectionsModerationSelectors.getCurrentReviewAction);
  isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);
  isCollectionProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  isReviewActionsLoading = select(CollectionsModerationSelectors.getCurrentReviewActionLoading);
  readonly activityPageSize = 5;
  readonly activityDefaultPage = 1;
  readonly SubmissionReviewStatus = SubmissionReviewStatus;

  private readonly actions = createDispatchMap({
    getProject: GetProjectById,
    getBookmarksId: GetBookmarksCollectionId,
    getHomeWiki: GetHomeWiki,
    getComponents: GetComponents,
    getLinkedProjects: GetLinkedResources,
    getActivityLogs: GetActivityLogs,
    setProjectCustomCitation: SetProjectCustomCitation,
    getCollectionProvider: GetCollectionProvider,
    getCurrentReviewAction: GetSubmissionsReviewActions,
    clearProjectOverview: ClearProjectOverview,
    clearWiki: ClearWiki,
    clearCollections: ClearCollections,
    clearCollectionModeration: ClearCollectionModeration,
  });

  readonly isCollectionsRoute = computed(() => {
    return this.router.url.includes('/collections');
  });

  readonly isModerationMode = computed(() => {
    const mode = this.route.snapshot.queryParams['mode'];

    return mode === Mode.Moderation;
  });

  submissionReviewStatus = computed(() => {
    return this.currentReviewAction()?.toState;
  });

  showDecisionButton = computed(() => {
    return (
      this.isCollectionsRoute() &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Removed &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Rejected
    );
  });

  currentProject = select(ProjectOverviewSelectors.getProject);
  isAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  currentProject$ = toObservable(this.currentProject);

  userPermissions = computed(() => {
    return this.currentProject()?.currentUserPermissions || [];
  });

  hasViewOnly = computed(() => {
    return hasViewOnlyParam(this.router);
  });

  get isAdmin(): boolean {
    return this.userPermissions().includes(UserPermissions.Admin);
  }

  get canWrite(): boolean {
    return this.userPermissions().includes(UserPermissions.Write);
  }

  resourceOverview = computed(() => {
    const project = this.currentProject();
    if (project) {
      return MapProjectOverview(project, this.isAnonymous());
    }
    return null;
  });

  isLoading = computed(() => {
    return this.isProjectLoading() || this.isCollectionProviderLoading() || this.isReviewActionsLoading();
  });

  currentResource = computed(() => {
    const project = this.currentProject();
    if (project) {
      return {
        id: project.id,
        isPublic: project.isPublic,
        storage: project.storage,
        viewOnlyLinksCount: project.viewOnlyLinksCount,
        forksCount: project.forksCount,
        resourceType: ResourceType.Project,
        isAnonymous: this.isAnonymous(),
      };
    }
    return null;
  });

  constructor() {
    this.setupCollectionsEffects();
    this.setupCleanup();
  }

  protected onCustomCitationUpdated(citation: string): void {
    this.actions.setProjectCustomCitation(citation);
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id'];
    if (projectId) {
      this.actions.getProject(projectId);
      this.actions.getBookmarksId();
      this.actions.getHomeWiki(ResourceType.Project, projectId);
      this.actions.getComponents(projectId);
      this.actions.getLinkedProjects(projectId);
      this.actions.getActivityLogs(projectId, this.activityDefaultPage.toString(), this.activityPageSize.toString());
      this.dataciteService.logIdentifiableView(this.currentProject$).subscribe();
    }
  }

  handleOpenMakeDecisionDialog() {
    const dialogWidth = this.isMobile() ? '95vw' : '600px';

    this.dialogService
      .open(MakeDecisionDialogComponent, {
        width: dialogWidth,
        focusOnShow: false,
        header: this.translateService.instant('moderation.makeDecision.header'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data && data.action) {
          this.toastService.showSuccess(`moderation.makeDecision.${data.action}Success`);
          this.goBack();
        }
      });
  }

  goBack(): void {
    const currentStatus = this.route.snapshot.queryParams['status'];
    const queryParams = currentStatus ? { status: currentStatus } : {};

    this.router.navigate(['../'], {
      relativeTo: this.route,
      queryParams,
    });
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
        const resource = this.currentResource();

        if (!provider || !resource) return;

        this.actions.getCurrentReviewAction(resource.id, provider.primaryCollection.id);
      }
    });
  }

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearProjectOverview();
      this.actions.clearWiki();
      this.actions.clearCollections();
      this.actions.clearCollectionModeration();
    });
  }
}
