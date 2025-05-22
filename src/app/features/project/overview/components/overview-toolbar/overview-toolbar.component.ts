import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  AddProjectToBookmarks,
  CollectionsSelectors,
  RemoveProjectFromBookmarks,
} from '@osf/features/collections/store';
import { GetMyBookmarks, MyProjectsSelectors } from '@osf/features/my-projects/store';
import {
  DuplicateDialogComponent,
  ForkDialogComponent,
  TogglePublicityDialogComponent,
} from '@osf/features/project/overview/components';
import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';

@Component({
  selector: 'osf-overview-toolbar',
  imports: [ToggleSwitch, TranslatePipe, Menu, Button, Tooltip, FormsModule, NgClass, RouterLink, NgOptimizedImage],
  templateUrl: './overview-toolbar.component.html',
  styleUrl: './overview-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewToolbarComponent {
  private store = inject(Store);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  protected currentProject = select(ProjectOverviewSelectors.getProject);
  protected isBookmarksLoading = select(MyProjectsSelectors.getBookmarksLoading);
  protected isBookmarksSubmitting = select(CollectionsSelectors.getBookmarksCollectionIdSubmitting);
  protected isPublic = signal(false);
  protected bookmarksCollectionId = select(CollectionsSelectors.getBookmarksCollectionId);
  protected bookmarkedProjects = select(MyProjectsSelectors.getBookmarks);
  protected isBookmarked = computed(() => {
    const project = this.currentProject();
    const bookmarks = this.bookmarkedProjects();

    if (!project || !bookmarks?.length) {
      return false;
    }

    return bookmarks.some((bookmark) => bookmark.id === project.id);
  });

  protected readonly forkActionItems = [
    {
      label: 'project.overview.actions.forkProject',
      command: () => this.handleForkProject(),
    },
    {
      label: 'project.overview.actions.duplicateProject',
      command: () => this.handleDuplicateProject(),
    },
    {
      label: 'project.overview.actions.viewDuplication',
      command: () => {
        //TODO: RNa redirect to duplication page
      },
    },
  ];

  protected readonly socialsActionItems = [
    {
      label: 'project.overview.actions.socials.email',
      icon: 'email',
    },
    {
      label: 'project.overview.actions.socials.x',
      icon: 'x',
    },
    {
      label: 'project.overview.actions.socials.linkedIn',
      icon: 'linkedin',
    },
    {
      label: 'project.overview.actions.socials.facebook',
      icon: 'facebook',
    },
  ];

  constructor() {
    effect(() => {
      const bookmarksId = this.bookmarksCollectionId();

      if (!bookmarksId) {
        return;
      }

      this.store.dispatch(new GetMyBookmarks(bookmarksId, 1, 100, {}));
    });

    effect(() => {
      const project = this.currentProject();
      if (project) {
        this.isPublic.set(project.isPublic);
      }
    });
  }

  private handleForkProject(): void {
    this.dialogService.open(ForkDialogComponent, {
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.fork.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
    // .onClose.subscribe((result: boolean) => {
    //   if (result) {
    //     const projectId = this.projectId();
    //     if (projectId) {
    //       this.store.dispatch(new GetProjectById(projectId));
    //     }
    //   }
    // });
  }

  private handleDuplicateProject(): void {
    this.dialogService.open(DuplicateDialogComponent, {
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.duplicate.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  protected handleToggleProjectPublicity(): void {
    const project = this.currentProject();
    if (!project) return;

    const isCurrentlyPublic = this.isPublic();
    const newPublicStatus = !isCurrentlyPublic;

    this.dialogService.open(TogglePublicityDialogComponent, {
      focusOnShow: false,
      header: this.translateService.instant(
        isCurrentlyPublic ? 'project.overview.dialog.makePrivate.header' : 'project.overview.dialog.makePublic.header'
      ),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        projectId: project.id,
        isCurrentlyPublic,
        newPublicStatus,
      },
    });
  }

  protected toggleBookmark(): void {
    const project = this.currentProject();
    const bookmarksId = this.bookmarksCollectionId();

    if (!project || !bookmarksId) return;

    if (this.isBookmarked()) {
      this.store.dispatch(new RemoveProjectFromBookmarks(bookmarksId, project.id)).subscribe({
        complete: () => {
          this.store.dispatch(new GetMyBookmarks(bookmarksId, 1, 100, {}));
        },
      });
    } else {
      this.store.dispatch(new AddProjectToBookmarks(bookmarksId, project.id)).subscribe({
        complete: () => {
          this.store.dispatch(new GetMyBookmarks(bookmarksId, 1, 100, {}));
        },
      });
    }
  }
}
