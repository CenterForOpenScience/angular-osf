import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { TagModule } from 'primeng/tag';

import { distinctUntilChanged, filter, map, skip, tap } from 'rxjs';

import { CommonModule, DatePipe } from '@angular/common';
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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';

import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  ClearCollectionModeration,
  CollectionsModerationSelectors,
  GetSubmissionsReviewActions,
} from '@osf/features/moderation/store/collections-moderation';
import { Mode, ResourceType } from '@osf/shared/enums';
import { hasViewOnlyParam } from '@osf/shared/helpers';
import { MapProjectOverview } from '@osf/shared/mappers';
import { CustomDialogService, MetaTagsService, ToastService } from '@osf/shared/services';
import {
  AddonsSelectors,
  ClearCollections,
  ClearConfiguredAddons,
  ClearWiki,
  CollectionsSelectors,
  CurrentResourceSelectors,
  FetchSelectedSubjects,
  GetAddonsResourceReference,
  GetBookmarksCollectionId,
  GetCollectionProvider,
  GetConfiguredCitationAddons,
  GetConfiguredStorageAddons,
  GetHomeWiki,
  GetLinkedResources,
  GetResourceWithChildren,
  SubjectsSelectors,
} from '@osf/shared/stores';
import { GetActivityLogs } from '@osf/shared/stores/activity-logs';
import {
  LoadingSpinnerComponent,
  MakeDecisionDialogComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@shared/components';
import { AnalyticsService } from '@shared/services/analytics.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { OverviewParentProjectComponent } from './components/overview-parent-project/overview-parent-project.component';
import {
  CitationAddonCardComponent,
  FilesWidgetComponent,
  LinkedResourcesComponent,
  OverviewComponentsComponent,
  OverviewToolbarComponent,
  OverviewWikiComponent,
  RecentActivityComponent,
} from './components';
import { SUBMISSION_REVIEW_STATUS_OPTIONS } from './constants';
import {
  ClearProjectOverview,
  GetComponents,
  GetParentProject,
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
    FilesWidgetComponent,
    ViewOnlyLinkMessageComponent,
    OverviewParentProjectComponent,
    CitationAddonCardComponent,
  ],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly dataciteService = inject(DataciteService);
  private readonly metaTags = inject(MetaTagsService);
  private readonly datePipe = inject(DatePipe);

  submissions = select(CollectionsModerationSelectors.getCollectionSubmissions);
  collectionProvider = select(CollectionsSelectors.getCollectionProvider);
  currentReviewAction = select(CollectionsModerationSelectors.getCurrentReviewAction);
  isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);
  isCollectionProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  isReviewActionsLoading = select(CollectionsModerationSelectors.getCurrentReviewActionLoading);
  components = select(CurrentResourceSelectors.getResourceWithChildren);
  areComponentsLoading = select(CurrentResourceSelectors.isResourceWithChildrenLoading);
  subjects = select(SubjectsSelectors.getSelectedSubjects);
  areSubjectsLoading = select(SubjectsSelectors.areSelectedSubjectsLoading);
  currentProject = select(ProjectOverviewSelectors.getProject);
  isAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  hasWriteAccess = select(ProjectOverviewSelectors.hasWriteAccess);
  hasAdminAccess = select(ProjectOverviewSelectors.hasAdminAccess);
  isWikiEnabled = select(ProjectOverviewSelectors.isWikiEnabled);
  parentProject = select(ProjectOverviewSelectors.getParentProject);
  isParentProjectLoading = select(ProjectOverviewSelectors.getParentProjectLoading);
  addonsResourceReference = select(AddonsSelectors.getAddonsResourceReference);
  configuredCitationAddons = select(AddonsSelectors.getConfiguredCitationAddons);
  operationInvocation = select(AddonsSelectors.getOperationInvocation);

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
    clearConfiguredAddons: ClearConfiguredAddons,
    getComponentsTree: GetResourceWithChildren,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    getSubjects: FetchSelectedSubjects,
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

  showDecisionButton = computed(() => {
    return (
      this.isCollectionsRoute() &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Removed &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Rejected
    );
  });

  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  resourceOverview = computed(() => {
    const project = this.currentProject();
    const subjects = this.subjects();
    if (project) {
      return MapProjectOverview(project, subjects, this.isAnonymous());
    }
    return null;
  });

  isLoading = computed(
    () =>
      this.isProjectLoading() ||
      this.isCollectionProviderLoading() ||
      this.isReviewActionsLoading() ||
      this.areSubjectsLoading()
  );

  currentProject$ = toObservable(this.currentProject);

  currentResource = computed(() => {
    const project = this.currentProject();
    if (project) {
      return {
        id: project.id,
        title: project.title,
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

  filesRootOption = computed(() => {
    return {
      value: this.currentProject()?.id ?? '',
      label: this.currentProject()?.title ?? '',
    };
  });

  private readonly metaTagsData = computed(() => {
    const project = this.currentProject();
    if (!project) return null;
    const keywords = [...(project.tags || [])];
    if (project.category) {
      keywords.push(project.category);
    }
    return {
      osfGuid: project.id,
      title: project.title,
      description: project.description,
      url: project.links?.iri,
      doi: project.doi,
      license: project.license?.name,
      publishedDate: this.datePipe.transform(project.dateCreated, 'yyyy-MM-dd'),
      modifiedDate: this.datePipe.transform(project.dateModified, 'yyyy-MM-dd'),
      keywords,
      institution: project.affiliatedInstitutions?.map((institution) => institution.name),
      contributors: project.contributors.map((contributor) => ({
        fullName: contributor.fullName,
        givenName: contributor.givenName,
        familyName: contributor.familyName,
      })),
    };
  });

  readonly analyticsService = inject(AnalyticsService);

  constructor() {
    this.setupCollectionsEffects();
    this.setupCleanup();
    this.setupProjectEffects();
    this.setupRouteChangeListener();
    this.setupAddonsEffects();

    effect(() => {
      if (!this.isProjectLoading()) {
        const metaTagsData = this.metaTagsData();
        if (metaTagsData) {
          this.metaTags.updateMetaTags(metaTagsData, this.destroyRef);
        }
      }
    });
  }

  onCustomCitationUpdated(citation: string): void {
    this.actions.setProjectCustomCitation(citation);
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id'];

    if (projectId) {
      this.actions.getProject(projectId);
      this.actions.getBookmarksId();
      this.actions.getComponents(projectId);
      this.actions.getLinkedProjects(projectId);
      this.actions.getActivityLogs(projectId, this.activityDefaultPage, this.activityPageSize);
    }

    this.dataciteService
      .logIdentifiableView(this.currentProject$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
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
        const resource = this.currentResource();

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
        this.actions.getSubjects(currentProject.id, ResourceType.Project);
        const parentProjectId = currentProject.parentId;
        if (parentProjectId) {
          this.actions.getParentProject(parentProjectId);
        }
      }
    });
    effect(() => {
      const project = this.currentProject();
      if (project?.wikiEnabled) {
        this.actions.getHomeWiki(ResourceType.Project, project.id);
      }
    });
    effect(() => {
      const currentProject = this.currentProject();
      if (currentProject && currentProject.isPublic) {
        this.analyticsService.sendCountedUsage(currentProject.id, 'project.detail').subscribe();
      }
    });
  }

  private setupRouteChangeListener(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id']),
        filter(Boolean),
        distinctUntilChanged(),
        skip(1),
        tap((projectId) => {
          this.actions.clearProjectOverview();
          this.actions.clearConfiguredAddons();
          this.actions.getProject(projectId);
          this.actions.getBookmarksId();
          this.actions.getComponents(projectId);
          this.actions.getLinkedProjects(projectId);
          this.actions.getActivityLogs(projectId, this.activityDefaultPage, this.activityPageSize);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
}
