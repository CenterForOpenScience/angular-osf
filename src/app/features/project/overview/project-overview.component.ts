import { createDispatchMap, select } from '@ngxs/store';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClearCollections, GetBookmarksCollectionId } from '@osf/features/collections/store/collections';
import { LoadingSpinnerComponent, ResourceMetadataComponent, SubHeaderComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { MapProjectOverview } from '@shared/mappers/resource-overview.mappers';

import { ClearWiki, GetHomeWiki } from '../wiki/store';

import {
  LinkedProjectsComponent,
  OverviewComponentsComponent,
  OverviewToolbarComponent,
  OverviewWikiComponent,
  RecentActivityComponent,
} from './components';
import {
  ClearProjectOverview,
  GetComponents,
  GetLinkedProjects,
  GetProjectById,
  ProjectOverviewSelectors,
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
    LinkedProjectsComponent,
    RecentActivityComponent,
    OverviewToolbarComponent,
    ResourceMetadataComponent,
  ],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';

  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  protected actions = createDispatchMap({
    getProject: GetProjectById,
    getBookmarksId: GetBookmarksCollectionId,
    getHomeWiki: GetHomeWiki,
    getComponents: GetComponents,
    getLinkedProjects: GetLinkedProjects,
    clearProjectOverview: ClearProjectOverview,
    clearWiki: ClearWiki,
    clearCollections: ClearCollections,
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

  ngOnInit(): void {
    const projectId = this.route.parent?.snapshot.params['id'];
    if (projectId) {
      this.actions.getProject(projectId);
      this.actions.getBookmarksId();
      this.actions.getHomeWiki(projectId);
      this.actions.getComponents(projectId);
      this.actions.getLinkedProjects(projectId);
    }
  }

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearProjectOverview();
      this.actions.clearWiki();
      this.actions.clearCollections();
    });
  }
}
