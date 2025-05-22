import { select, Store } from '@ngxs/store';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GetBookmarksCollectionId } from '@osf/features/collections/store';
import { LinkedProjectsComponent } from '@osf/features/project/overview/components/linked-projects/linked-projects.component';
import { OverviewComponentsComponent } from '@osf/features/project/overview/components/overview-components/overview-components.component';
import { OverviewMetadataComponent } from '@osf/features/project/overview/components/overview-metadata/overview-metadata.component';
import { OverviewToolbarComponent } from '@osf/features/project/overview/components/overview-toolbar/overview-toolbar.component';
import { OverviewWikiComponent } from '@osf/features/project/overview/components/project-wiki/overview-wiki.component';
import { RecentActivityComponent } from '@osf/features/project/overview/components/recent-activity/recent-activity.component';
import { ClearWiki, GetHomeWiki } from '@osf/features/project/wiki/store';
import { LoadingSpinnerComponent } from '@shared/components';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

import {
  ClearProjectOverview,
  GetComponents,
  GetLinkedProjects,
  GetProjectById,
} from './store/project-overview.actions';
import { ProjectOverviewSelectors } from './store/project-overview.selectors';

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
    OverviewMetadataComponent,
    OverviewToolbarComponent,
  ],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';

  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  protected currentProject = select(ProjectOverviewSelectors.getProject);
  protected isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);

  constructor() {
    this.setupCleanup();
  }

  ngOnInit(): void {
    const projectId = this.route.parent?.snapshot.params['id'];
    if (projectId) {
      this.store.dispatch(new GetProjectById(projectId));
      this.store.dispatch(new GetBookmarksCollectionId());
      this.store.dispatch(new GetHomeWiki(projectId));
      this.store.dispatch(new GetComponents(projectId));
      this.store.dispatch(new GetLinkedProjects(projectId));
    }
  }

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.store.dispatch(new ClearProjectOverview());
      this.store.dispatch(new ClearWiki());
    });
  }
}
