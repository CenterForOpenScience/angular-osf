import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ForkRegistry } from '@osf/features/registry/store/registry';
import { ForkMenuButtonComponent } from '@osf/shared/components/fork-menu-button/fork-menu-button.component';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ForkDialogService } from '@osf/shared/services/fork-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  AddResourceToBookmarks,
  BookmarksSelectors,
  GetResourceBookmark,
  RemoveResourceFromBookmarks,
} from '@osf/shared/stores/bookmarks';

@Component({
  selector: 'osf-registration-overview-toolbar',
  imports: [Button, Tooltip, SocialsShareButtonComponent, ForkMenuButtonComponent, TranslatePipe],
  templateUrl: './registration-overview-toolbar.component.html',
  styleUrl: './registration-overview-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationOverviewToolbarComponent {
  private readonly toastService = inject(ToastService);
  private readonly forkDialogService = inject(ForkDialogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly resourceId = input.required<string>();
  readonly resourceTitle = input.required<string>();
  readonly isPublic = input<boolean>(false);
  readonly forksCount = input<number>(0);
  readonly viewOnly = input<boolean>(false);

  readonly resourceType = ResourceType.Registration;

  readonly bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  readonly bookmarks = select(BookmarksSelectors.getBookmarks);
  readonly isBookmarksLoading = select(BookmarksSelectors.areBookmarksLoading);
  readonly isBookmarksSubmitting = select(BookmarksSelectors.getBookmarksCollectionIdSubmitting);
  readonly isAuthenticated = select(UserSelectors.isAuthenticated);
  readonly preventDuplicateCreation = select(UserSelectors.isProjectCreationDisabled);

  readonly isBookmarked = computed(
    () => this.bookmarks()?.some((bookmark) => bookmark.id === this.resourceId()) ?? false
  );

  private readonly actions = createDispatchMap({
    getResourceBookmark: GetResourceBookmark,
    addResourceToBookmarks: AddResourceToBookmarks,
    removeResourceFromBookmarks: RemoveResourceFromBookmarks,
    forkRegistry: ForkRegistry,
  });

  readonly forkActionItems: MenuItem[] = [
    {
      label: 'project.overview.actions.duplicateRegistration',
      command: () => this.handleForkResource(),
    },
    {
      label: 'project.overview.actions.viewDuplication',
      command: () => this.navigateToDuplicatesView(),
    },
  ];

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

  navigateToDuplicatesView(): void {
    this.router.navigate(['../analytics/duplicates'], { relativeTo: this.route });
  }

  private handleForkResource(): void {
    if (!this.resourceId()) return;

    this.forkDialogService.confirmFork({
      resourceType: CurrentResourceType.Registrations,
      destroyRef: this.destroyRef,
      fork: () => this.actions.forkRegistry(this.resourceId()),
    });
  }
}
