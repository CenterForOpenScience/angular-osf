import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { TagModule } from 'primeng/tag';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubmissionReviewStatus } from '@osf/features/moderation/enums';
import {
  LoadingSpinnerComponent,
  MakeDecisionDialogComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
} from '@shared/components';
import { ResourceType } from '@shared/enums';
import { MapProjectOverview } from '@shared/mappers/resource-overview.mappers';
import { ToastService } from '@shared/services';
import { CollectionsSelectors, GetAllNodeLinks, GetBookmarksCollectionId, GetLinkedResources } from '@shared/stores';
import { ClearCollections } from '@shared/stores/collections';
import { IS_XSMALL } from '@shared/utils';

import {
  ClearCollectionModeration,
  CollectionsModerationSelectors,
} from '../../moderation/store/collections-moderation';
import { ClearWiki, GetHomeWiki } from '../wiki/store';

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
  ],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  protected readonly toastService = inject(ToastService);
  protected readonly dialogService = inject(DialogService);
  protected readonly translateService = inject(TranslateService);
  protected isMobile = toSignal(inject(IS_XSMALL));
  protected currentReviewAction = select(CollectionsModerationSelectors.getCurrentReviewAction);
  protected currentSubmission = select(CollectionsModerationSelectors.getCurrentSubmission);
  protected collection = select(CollectionsSelectors.getCollectionDetails);

  protected actions = createDispatchMap({
    getProject: GetProjectById,
    getBookmarksId: GetBookmarksCollectionId,
    getHomeWiki: GetHomeWiki,
    getComponents: GetComponents,
    getLinkedProjects: GetLinkedResources,
    getNodeLinks: GetAllNodeLinks,
    setProjectCustomCitation: SetProjectCustomCitation,
    clearProjectOverview: ClearProjectOverview,
    clearWiki: ClearWiki,
    clearCollections: ClearCollections,
    clearCollectionModeration: ClearCollectionModeration,
  });

  readonly isCollectionsRoute = computed(() => {
    return this.router.url.includes('/collections');
  });

  submissionReviewStatus = computed(() => {
    return this.currentReviewAction()?.toState;
  });

  protected showDecisionButton = computed(() => {
    return (
      this.isCollectionsRoute() &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Removed &&
      this.submissionReviewStatus() !== SubmissionReviewStatus.Rejected
    );
  });

  protected currentProject = select(ProjectOverviewSelectors.getProject);
  protected resourceOverview = computed(() => {
    const project = this.currentProject();
    if (project) {
      return MapProjectOverview(project);
    }
    return null;
  });
  protected isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);
  protected currentResource = computed(() => {
    if (this.currentProject()) {
      return {
        id: this.currentProject()!.id,
        isPublic: this.currentProject()!.isPublic,
        storage: this.currentProject()!.storage,
        viewOnlyLinksCount: this.currentProject()!.viewOnlyLinksCount,
        forksCount: this.currentProject()!.forksCount,
        resourceType: ResourceType.Project,
      };
    }
    return null;
  });

  constructor() {
    this.setupCleanup();
  }

  onCustomCitationUpdated(citation: string): void {
    this.actions.setProjectCustomCitation(citation);
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['id'] || this.route.parent?.snapshot.params['id'];
    if (projectId) {
      this.actions.getProject(projectId);
      this.actions.getBookmarksId();
      this.actions.getHomeWiki(projectId);
      this.actions.getComponents(projectId);
      this.actions.getNodeLinks(projectId);
      this.actions.getLinkedProjects(projectId);
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
        data: {
          submission: this.currentSubmission(),
          reviewAction: this.currentReviewAction(),
        },
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

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearProjectOverview();
      this.actions.clearWiki();
      this.actions.clearCollections();
      this.actions.clearCollectionModeration();
    });
  }

  protected readonly SubmissionReviewStatus = SubmissionReviewStatus;
}
