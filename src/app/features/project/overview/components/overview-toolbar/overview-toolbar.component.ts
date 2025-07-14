import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { timer } from 'rxjs';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { GetMyBookmarks, MyProjectsSelectors } from '@osf/features/my-projects/store';
import { DuplicateDialogComponent, TogglePublicityDialogComponent } from '@osf/features/project/overview/components';
import { IconComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';
import { ResourceType } from '@shared/enums';
import { ToolbarResource } from '@shared/models';
import { FileSizePipe } from '@shared/pipes';
import { AddResourceToBookmarks, BookmarksSelectors, RemoveResourceFromBookmarks } from '@shared/stores';

import { SOCIAL_ACTION_ITEMS } from '../../constants';
import { ForkDialogComponent } from '../fork-dialog/fork-dialog.component';

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
    FileSizePipe,
    IconComponent,
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

  currentResource = input.required<ToolbarResource | null>();
  visibilityToggle = input<boolean>(true);
  showViewOnlyLinks = input<boolean>(true);
  protected isBookmarksLoading = select(MyProjectsSelectors.getBookmarksLoading);
  protected isBookmarksSubmitting = select(BookmarksSelectors.getBookmarksCollectionIdSubmitting);
  protected bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  protected bookmarkedProjects = select(MyProjectsSelectors.getBookmarks);
  protected readonly socialsActionItems = SOCIAL_ACTION_ITEMS;
  protected readonly forkActionItems = [
    {
      label: 'project.overview.actions.forkResource',
      command: () => this.handleForkResource(),
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
  protected readonly ResourceType = ResourceType;

  constructor() {
    effect(() => {
      const bookmarksId = this.bookmarksCollectionId();
      const resource = this.currentResource();

      if (!bookmarksId || !resource) {
        return;
      }

      this.store.dispatch(new GetMyBookmarks(bookmarksId, 1, 100, {}, resource.resourceType));
    });

    effect(() => {
      const resource = this.currentResource();
      if (resource) {
        this.isPublic.set(resource.isPublic);
      }
    });

    effect(() => {
      const resource = this.currentResource();
      const bookmarks = this.bookmarkedProjects();

      if (!resource || !bookmarks?.length) {
        this.isBookmarked.set(false);
        return;
      }

      this.isBookmarked.set(bookmarks.some((bookmark) => bookmark.id === resource.id));
    });

    effect(() => {
      const resource = this.currentResource();

      if (resource) {
        this.forkActionItems[0].label =
          this.currentResource()?.resourceType === ResourceType.Project
            ? 'project.overview.actions.forkProject'
            : this.currentResource()?.resourceType === ResourceType.Registration
              ? 'project.overview.actions.forkRegistry'
              : 'project.overview.actions.forkResource';
      }
    });
  }

  private handleForkResource(): void {
    const resource = this.currentResource();
    const headerTranslation =
      resource?.resourceType === ResourceType.Project
        ? 'project.overview.dialog.fork.headerProject'
        : resource?.resourceType === ResourceType.Registration
          ? 'project.overview.dialog.fork.headerRegistry'
          : '';
    if (resource) {
      this.dialogService.open(ForkDialogComponent, {
        focusOnShow: false,
        header: this.translateService.instant(headerTranslation),
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: {
          resource: resource,
        },
      });
    }
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
    const resource = this.currentResource();
    if (!resource) return;

    const isCurrentlyPublic = resource.isPublic;
    const newPublicStatus = !isCurrentlyPublic;

    timer(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isPublic.set(resource.isPublic));

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
        projectId: resource.id,
        isCurrentlyPublic,
        newPublicStatus,
      },
    });
  }

  protected toggleBookmark(): void {
    const resource = this.currentResource();
    const bookmarksId = this.bookmarksCollectionId();

    if (!resource || !bookmarksId) return;

    const newBookmarkState = !this.isBookmarked();

    if (!newBookmarkState) {
      this.store
        .dispatch(new RemoveResourceFromBookmarks(bookmarksId, resource.id, resource.resourceType))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isBookmarked.set(newBookmarkState);
            this.toastService.showSuccess('project.overview.dialog.toast.bookmark.remove');
          },
        });
    } else {
      this.store
        .dispatch(new AddResourceToBookmarks(bookmarksId, resource.id, resource.resourceType))
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
