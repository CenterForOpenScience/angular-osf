import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { timer } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ClearDuplicatedProject, ForkProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ForkMenuButtonComponent } from '@osf/shared/components/fork-menu-button/fork-menu-button.component';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { FileSizePipe } from '@osf/shared/pipes/file-size.pipe';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ForkDialogService } from '@osf/shared/services/fork-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  AddResourceToBookmarks,
  BookmarksSelectors,
  GetResourceBookmark,
  RemoveResourceFromBookmarks,
} from '@osf/shared/stores/bookmarks';

import { ProjectOverviewModel } from '../../models';
import { DuplicateDialogComponent } from '../duplicate-dialog/duplicate-dialog.component';
import { TogglePublicityDialogComponent } from '../toggle-publicity-dialog/toggle-publicity-dialog.component';

@Component({
  selector: 'osf-project-overview-toolbar',
  imports: [
    ToggleSwitch,
    TranslatePipe,
    Button,
    Tooltip,
    FormsModule,
    RouterLink,
    FileSizePipe,
    SocialsShareButtonComponent,
    ForkMenuButtonComponent,
  ],
  templateUrl: './project-overview-toolbar.component.html',
  styleUrl: './project-overview-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewToolbarComponent {
  private readonly customDialogService = inject(CustomDialogService);
  private readonly forkDialogService = inject(ForkDialogService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly canEdit = input.required<boolean>();
  readonly storage = input<NodeStorageModel | null>();
  readonly viewOnly = input<boolean>(false);
  readonly currentResource = input.required<ProjectOverviewModel>();

  isPublic = signal(false);
  isBookmarked = signal(false);

  readonly resourceType = ResourceType.Project;

  readonly bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  readonly bookmarks = select(BookmarksSelectors.getBookmarks);
  readonly isBookmarksLoading = select(BookmarksSelectors.areBookmarksLoading);
  readonly isBookmarksSubmitting = select(BookmarksSelectors.getBookmarksCollectionIdSubmitting);

  readonly duplicatedProject = select(ProjectOverviewSelectors.getDuplicatedProject);
  readonly isAuthenticated = select(UserSelectors.isAuthenticated);
  readonly preventDuplicateCreation = select(UserSelectors.isProjectCreationDisabled);
  readonly isProjectReadOnly = select(UserSelectors.isProjectReadOnly);

  readonly actions = createDispatchMap({
    getResourceBookmark: GetResourceBookmark,
    addResourceToBookmarks: AddResourceToBookmarks,
    removeResourceFromBookmarks: RemoveResourceFromBookmarks,
    clearDuplicatedProject: ClearDuplicatedProject,
    forkProject: ForkProject,
  });

  readonly disableProjectPrivacyToggle = computed(() => this.isProjectReadOnly() && this.isPublic());
  readonly projectReadOnlyTooltip = computed(() =>
    this.disableProjectPrivacyToggle() ? 'common.errorMessages.actionUnavailable' : ''
  );

  readonly forkActionItems: MenuItem[] = [
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
      command: () => this.navigateToDuplicatesView(),
    },
  ];

  constructor() {
    effect(() => {
      const bookmarksId = this.bookmarksCollectionId();
      const resource = this.currentResource();

      if (!bookmarksId || !resource) return;

      this.actions.getResourceBookmark(bookmarksId, resource.id, this.resourceType);
    });

    effect(() => {
      const resource = this.currentResource();
      if (resource) {
        this.isPublic.set(resource.isPublic);
      }
    });

    effect(() => {
      const resource = this.currentResource();
      const bookmarks = this.bookmarks();

      if (!resource || !bookmarks?.length) {
        this.isBookmarked.set(false);
        return;
      }

      this.isBookmarked.set(bookmarks.some((bookmark) => bookmark.id === resource.id));
    });
  }

  handleToggleProjectPublicity(): void {
    const resource = this.currentResource();
    if (!resource) return;

    const isCurrentlyPublic = resource.isPublic;

    timer(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isPublic.set(resource.isPublic));

    this.customDialogService.open(TogglePublicityDialogComponent, {
      header: isCurrentlyPublic
        ? 'project.overview.dialog.makePrivate.header'
        : 'project.overview.dialog.makePublic.header',
      width: '600px',
      data: {
        projectId: resource.id,
        isCurrentlyPublic,
      },
    });
  }

  toggleBookmark(): void {
    const resource = this.currentResource();
    const bookmarksId = this.bookmarksCollectionId();

    if (!resource || !bookmarksId) return;

    const newBookmarkState = !this.isBookmarked();

    if (newBookmarkState) {
      this.actions
        .addResourceToBookmarks(bookmarksId, resource.id, this.resourceType)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isBookmarked.set(newBookmarkState);
          this.toastService.showSuccess('project.overview.dialog.toast.bookmark.add');
        });
    } else {
      this.actions
        .removeResourceFromBookmarks(bookmarksId, resource.id, this.resourceType)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isBookmarked.set(newBookmarkState);
          this.toastService.showSuccess('project.overview.dialog.toast.bookmark.remove');
        });
    }
  }

  navigateToDuplicatesView(): void {
    this.router.navigate(['../analytics/duplicates'], { relativeTo: this.route });
  }

  private handleForkProject(): void {
    const resource = this.currentResource();
    if (!resource) return;

    this.forkDialogService.confirmFork({
      resourceType: CurrentResourceType.Projects,
      destroyRef: this.destroyRef,
      fork: () => this.actions.forkProject(resource.id),
    });
  }

  private handleDuplicateProject(): void {
    this.customDialogService
      .open(DuplicateDialogComponent, { header: 'project.overview.dialog.duplicate.header' })
      .onClose.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const duplicatedProject = this.duplicatedProject();
          if (duplicatedProject) {
            this.router.navigate(['/', duplicatedProject.id]);
          }
        },
        complete: () => this.actions.clearDuplicatedProject(),
      });
  }
}
