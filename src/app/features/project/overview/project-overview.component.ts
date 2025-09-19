import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { TagModule } from 'primeng/tag';

import { distinctUntilChanged, filter, map } from 'rxjs';

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
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';

import { GetRootFolders } from '@osf/features/files/store';
import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  ClearCollectionModeration,
  CollectionsModerationSelectors,
  GetSubmissionsReviewActions,
} from '@osf/features/moderation/store/collections-moderation';
import { Mode, ResourceType, UserPermissions } from '@osf/shared/enums';
import { hasViewOnlyParam, IS_XSMALL } from '@osf/shared/helpers';
import { MapProjectOverview } from '@osf/shared/mappers';
import { MetaTagsService, ToastService } from '@osf/shared/services';
import {
  ClearCollections,
  ClearWiki,
  CollectionsSelectors,
  CurrentResourceSelectors,
  FetchSelectedSubjects,
  GetBookmarksCollectionId,
  GetCollectionProvider,
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
import { DataciteService } from '@shared/services/datacite/datacite.service';

import {
  FilesWidgetComponent,
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
    FilesWidgetComponent,
    ViewOnlyLinkMessageComponent,
    ViewOnlyLinkMessageComponent,
  ],
  providers: [DialogService, DatePipe],
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
  private readonly metaTags = inject(MetaTagsService);
  private readonly datePipe = inject(DatePipe);

  isMobile = toSignal(inject(IS_XSMALL));
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
    getComponentsTree: GetResourceWithChildren,
    getRootFolders: GetRootFolders,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    getSubjects: FetchSelectedSubjects,
  });

  currentProject = select(ProjectOverviewSelectors.getProject);
  isAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  private currentProject$ = toObservable(this.currentProject);

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

  userPermissions = computed(() => this.currentProject()?.currentUserPermissions || []);
  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  get isAdmin(): boolean {
    return this.userPermissions().includes(UserPermissions.Admin);
  }

  get canWrite(): boolean {
    return this.userPermissions().includes(UserPermissions.Write);
  }

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

  filesRootOption = computed(() => {
    return {
      value: this.currentProject()?.id ?? '',
      label: this.currentProject()?.title ?? '',
    };
  });

  private readonly effectMetaTags = effect(() => {
    if (!this.isProjectLoading()) {
      const metaTagsData = this.metaTagsData();
      if (metaTagsData) {
        this.metaTags.updateMetaTags(metaTagsData, this.destroyRef);
      }
    }
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

  constructor() {
    this.setupCollectionsEffects();
    this.setupCleanup();
    this.setupRouteChangeEffects();

    effect(() => {
      const currentProject = this.currentProject();
      if (currentProject) {
        const rootParentId = currentProject.rootParentId ?? currentProject.id;
        this.actions.getComponentsTree(rootParentId, currentProject.id, ResourceType.Project);
        this.actions.getSubjects(currentProject.id, ResourceType.Project);
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
      this.actions.getHomeWiki(ResourceType.Project, projectId);
      this.actions.getComponents(projectId);
      this.actions.getLinkedProjects(projectId);
      this.actions.getActivityLogs(projectId, this.activityDefaultPage, this.activityPageSize);
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

  private setupRouteChangeEffects(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id']),
        filter(Boolean),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((projectId) => {
        this.actions.clearProjectOverview();
        this.actions.getProject(projectId);
        this.actions.getBookmarksId();
        this.actions.getHomeWiki(ResourceType.Project, projectId);
        this.actions.getComponents(projectId);
        this.actions.getLinkedProjects(projectId);
        this.actions.getActivityLogs(projectId, this.activityDefaultPage, this.activityPageSize);
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
