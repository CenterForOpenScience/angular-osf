import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@core/store/user';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  AddResourceToBookmarks,
  BookmarksSelectors,
  GetResourceBookmark,
  RemoveResourceFromBookmarks,
} from '@osf/shared/stores/bookmarks';

@Component({
  selector: 'osf-registration-overview-toolbar',
  imports: [Button, Tooltip, SocialsShareButtonComponent, TranslatePipe],
  templateUrl: './registration-overview-toolbar.component.html',
  styleUrl: './registration-overview-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationOverviewToolbarComponent {
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  resourceId = input.required<string>();
  resourceTitle = input.required<string>();
  isPublic = input<boolean>(false);

  isBookmarked = signal(false);
  resourceType = ResourceType.Registration;

  bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  bookmarks = select(BookmarksSelectors.getBookmarks);
  isBookmarksLoading = select(BookmarksSelectors.areBookmarksLoading);
  isBookmarksSubmitting = select(BookmarksSelectors.getBookmarksCollectionIdSubmitting);
  isAuthenticated = select(UserSelectors.isAuthenticated);

  actions = createDispatchMap({
    getResourceBookmark: GetResourceBookmark,
    addResourceToBookmarks: AddResourceToBookmarks,
    removeResourceFromBookmarks: RemoveResourceFromBookmarks,
  });

  constructor() {
    effect(() => {
      const bookmarksCollectionId = this.bookmarksCollectionId();

      if (!bookmarksCollectionId || !this.resourceId()) return;

      this.actions.getResourceBookmark(bookmarksCollectionId, this.resourceId(), this.resourceType);
    });

    effect(() => {
      const bookmarks = this.bookmarks();

      if (!this.resourceId() || !bookmarks?.length) {
        this.isBookmarked.set(false);
        return;
      }

      this.isBookmarked.set(bookmarks.some((bookmark) => bookmark.id === this.resourceId()));
    });
  }

  toggleBookmark(): void {
    const bookmarksId = this.bookmarksCollectionId();

    if (!this.resourceId() || !bookmarksId) return;

    const newBookmarkState = !this.isBookmarked();

    if (newBookmarkState) {
      this.actions
        .addResourceToBookmarks(bookmarksId, this.resourceId(), this.resourceType)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isBookmarked.set(newBookmarkState);
          this.toastService.showSuccess('project.overview.dialog.toast.bookmark.add');
        });
    } else {
      this.actions
        .removeResourceFromBookmarks(bookmarksId, this.resourceId(), this.resourceType)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isBookmarked.set(newBookmarkState);
          this.toastService.showSuccess('project.overview.dialog.toast.bookmark.remove');
        });
    }
  }
}
