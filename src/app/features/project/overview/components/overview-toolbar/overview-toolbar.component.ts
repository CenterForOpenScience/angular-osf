import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { timer } from 'rxjs';

import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  AddProjectToBookmarks,
  CollectionsSelectors,
  RemoveProjectFromBookmarks,
} from '@osf/features/collections/store';
import { GetMyBookmarks, MyProjectsSelectors } from '@osf/features/my-projects/store';
import { ToastService } from '@osf/shared/services';
import { FileSizePipe } from '@shared/pipes';

import { SOCIAL_ACTION_ITEMS } from '../../constants';
import { ProjectOverviewSelectors } from '../../store';
import { DuplicateDialogComponent } from '../duplicate-dialog/duplicate-dialog.component';
import { ForkDialogComponent } from '../fork-dialog/fork-dialog.component';
import { TogglePublicityDialogComponent } from '../toggle-publicity-dialog/toggle-publicity-dialog.component';

@Component({
  selector: 'osf-overview-toolbar',
  imports: [
    ToggleSwitch,
    TranslatePipe,
    Menu,
    Button,
    Tooltip,
    FormsModule,
    NgClass,
    RouterLink,
    NgOptimizedImage,
    FileSizePipe,
  ],
  templateUrl: './overview-toolbar.component.html',
  styleUrl: './overview-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewToolbarComponent {
  private store = inject(Store);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  protected destroyRef = inject(DestroyRef);
  protected isPublic = signal(false);
  protected isBookmarked = signal(false);
  protected currentProject = select(ProjectOverviewSelectors.getProject);
  protected isBookmarksLoading = select(MyProjectsSelectors.getBookmarksLoading);
  protected isBookmarksSubmitting = select(CollectionsSelectors.getBookmarksCollectionIdSubmitting);
  protected bookmarksCollectionId = select(CollectionsSelectors.getBookmarksCollectionId);
  protected bookmarkedProjects = select(MyProjectsSelectors.getBookmarks);
  protected readonly socialsActionItems = SOCIAL_ACTION_ITEMS;
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

    effect(() => {
      const project = this.currentProject();
      const bookmarks = this.bookmarkedProjects();

      if (!project || !bookmarks?.length) {
        this.isBookmarked.set(false);
        return;
      }

      this.isBookmarked.set(bookmarks.some((bookmark) => bookmark.id === project.id));
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

    const isCurrentlyPublic = project.isPublic;
    const newPublicStatus = !isCurrentlyPublic;

    timer(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isPublic.set(project.isPublic));

    this.dialogService.open(TogglePublicityDialogComponent, {
      focusOnShow: false,
      width: '40vw',
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

    const newBookmarkState = !this.isBookmarked();

    if (!newBookmarkState) {
      this.store
        .dispatch(new RemoveProjectFromBookmarks(bookmarksId, project.id))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isBookmarked.set(newBookmarkState);
            this.toastService.showSuccess('project.overview.dialog.toast.bookmark.remove');
          },
        });
    } else {
      this.store
        .dispatch(new AddProjectToBookmarks(bookmarksId, project.id))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isBookmarked.set(newBookmarkState);
            this.toastService.showSuccess('project.overview.dialog.toast.bookmark.add');
          },
        });
    }
  }
}
