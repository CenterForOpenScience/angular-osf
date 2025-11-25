import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { timer } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ClearDuplicatedProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { FileSizePipe } from '@osf/shared/pipes/file-size.pipe';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  AddResourceToBookmarks,
  BookmarksSelectors,
  GetResourceBookmark,
  RemoveResourceFromBookmarks,
} from '@osf/shared/stores/bookmarks';

import { ProjectOverviewModel } from '../../models';
import { DuplicateDialogComponent } from '../duplicate-dialog/duplicate-dialog.component';
import { ForkDialogComponent } from '../fork-dialog/fork-dialog.component';
import { TogglePublicityDialogComponent } from '../toggle-publicity-dialog/toggle-publicity-dialog.component';

@Component({
  selector: 'osf-project-overview-toolbar',
  imports: [
    ToggleSwitch,
    TranslatePipe,
    Menu,
    Button,
    Tooltip,
    FormsModule,
    RouterLink,
    FileSizePipe,
    SocialsShareButtonComponent,
  ],
  templateUrl: './project-overview-toolbar.component.html',
  styleUrl: './project-overview-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewToolbarComponent {
  private customDialogService = inject(CustomDialogService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  canEdit = input.required<boolean>();
  storage = input<NodeStorageModel | null>();
  viewOnly = input<boolean>(false);
  currentResource = input.required<ProjectOverviewModel>();

  isPublic = signal(false);
  isBookmarked = signal(false);
  resourceType = ResourceType.Registration;

  bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  bookmarks = select(BookmarksSelectors.getBookmarks);
  isBookmarksLoading = select(BookmarksSelectors.areBookmarksLoading);
  isBookmarksSubmitting = select(BookmarksSelectors.getBookmarksCollectionIdSubmitting);

  duplicatedProject = select(ProjectOverviewSelectors.getDuplicatedProject);
  isAuthenticated = select(UserSelectors.isAuthenticated);

  actions = createDispatchMap({
    getResourceBookmark: GetResourceBookmark,
    addResourceToBookmarks: AddResourceToBookmarks,
    removeResourceFromBookmarks: RemoveResourceFromBookmarks,
    clearDuplicatedProject: ClearDuplicatedProject,
  });

  readonly ResourceType = ResourceType;

  readonly forkActionItems = [
    {
      label: 'project.overview.actions.forkProject',
      command: () => this.handleForkResource(),
    },
    {
      label: 'project.overview.actions.duplicateProject',
      command: () => this.handleDuplicateProject(),
    },
    {
      label: 'project.overview.actions.viewDuplication',
      command: () => {
        this.router.navigate(['../analytics/duplicates'], { relativeTo: this.route });
      },
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

  private handleForkResource(): void {
    const resource = this.currentResource();

    if (resource) {
      this.customDialogService.open(ForkDialogComponent, {
        header: 'project.overview.dialog.fork.headerProject',
        data: { resourceId: resource.id, resourceType: this.resourceType },
      });
    }
  }

  private handleDuplicateProject(): void {
    this.customDialogService
      .open(DuplicateDialogComponent, { header: 'project.overview.dialog.duplicate.header' })
      .onClose.subscribe({
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
