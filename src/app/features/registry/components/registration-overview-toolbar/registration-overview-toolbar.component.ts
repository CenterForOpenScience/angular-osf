import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input } from '@angular/core';
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
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly resourceId = input.required<string>();
  readonly resourceTitle = input.required<string>();
  readonly isPublic = input<boolean>(false);

  readonly resourceType = ResourceType.Registration;

  readonly bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  readonly bookmarks = select(BookmarksSelectors.getBookmarks);
  readonly isBookmarksLoading = select(BookmarksSelectors.areBookmarksLoading);
  readonly isBookmarksSubmitting = select(BookmarksSelectors.getBookmarksCollectionIdSubmitting);
  readonly isAuthenticated = select(UserSelectors.isAuthenticated);

  readonly isBookmarked = computed(
    () => this.bookmarks()?.some((bookmark) => bookmark.id === this.resourceId()) ?? false
  );

  private readonly actions = createDispatchMap({
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
  }

  toggleBookmark(): void {
    const bookmarksId = this.bookmarksCollectionId();

    if (!this.resourceId() || !bookmarksId) return;

    const action = this.isBookmarked()
      ? this.actions.removeResourceFromBookmarks(bookmarksId, this.resourceId(), this.resourceType)
      : this.actions.addResourceToBookmarks(bookmarksId, this.resourceId(), this.resourceType);

    const toastKey = this.isBookmarked()
      ? 'project.overview.dialog.toast.bookmark.remove'
      : 'project.overview.dialog.toast.bookmark.add';

    action.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.toastService.showSuccess(toastKey));
  }
}
