import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { timer } from 'rxjs';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ClearDuplicatedProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { IconComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { ShareableContent, ToolbarResource } from '@osf/shared/models';
import { FileSizePipe } from '@osf/shared/pipes';
import { SocialShareService, ToastService } from '@osf/shared/services';
import {
  AddResourceToBookmarks,
  BookmarksSelectors,
  GetMyBookmarks,
  MyResourcesSelectors,
  RemoveResourceFromBookmarks,
} from '@osf/shared/stores';
import { hasViewOnlyParam, IS_SMALL } from '@shared/helpers';

import { SocialsShareActionItem } from '../../models';
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
  private socialShareService = inject(SocialShareService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  destroyRef = inject(DestroyRef);
  isPublic = signal(false);
  isBookmarked = signal(false);
  isMobile = toSignal(inject(IS_SMALL));

  isCollectionsRoute = input<boolean>(false);
  canEdit = input.required<boolean>();
  currentResource = input.required<ToolbarResource | null>();
  projectDescription = input<string>('');
  showViewOnlyLinks = input<boolean>(true);

  isBookmarksLoading = select(MyResourcesSelectors.getBookmarksLoading);
  isBookmarksSubmitting = select(BookmarksSelectors.getBookmarksCollectionIdSubmitting);
  bookmarksCollectionId = select(BookmarksSelectors.getBookmarksCollectionId);
  bookmarkedProjects = select(MyResourcesSelectors.getBookmarks);
  duplicatedProject = select(ProjectOverviewSelectors.getDuplicatedProject);
  socialsActionItems = computed(() => {
    const shareableContent = this.createShareableContent();
    return shareableContent ? this.buildSocialActionItems(shareableContent) : [];
  });

  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  actions = createDispatchMap({ clearDuplicatedProject: ClearDuplicatedProject });

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
  readonly ResourceType = ResourceType;

  get isRegistration(): boolean {
    return this.currentResource()?.resourceType === ResourceType.Registration;
  }

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
  }

  handleToggleProjectPublicity(): void {
    const resource = this.currentResource();
    if (!resource) return;
    const dialogWidth = this.isMobile() ? '95vw' : '600px';

    const isCurrentlyPublic = resource.isPublic;
    const newPublicStatus = !isCurrentlyPublic;

    timer(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isPublic.set(resource.isPublic));

    this.dialogService.open(TogglePublicityDialogComponent, {
      focusOnShow: false,
      width: dialogWidth,
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

  toggleBookmark(): void {
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
    this.dialogService
      .open(DuplicateDialogComponent, {
        focusOnShow: false,
        header: this.translateService.instant('project.overview.dialog.duplicate.header'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
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

  private createShareableContent(): ShareableContent | null {
    const resource = this.currentResource();
    const description = this.projectDescription();

    if (!resource?.isPublic) {
      return null;
    }

    return {
      id: resource.id,
      title: resource.title,
      description,
      url: this.buildResourceUrl(resource),
    };
  }

  private buildResourceUrl(resource: ToolbarResource): string {
    switch (resource.resourceType) {
      case ResourceType.Project:
        return this.socialShareService.createProjectUrl(resource.id);
      case ResourceType.Registration:
        return this.socialShareService.createRegistrationUrl(resource.id);
      default:
        return `${window.location.origin}/${resource.id}`;
    }
  }

  private buildSocialActionItems(shareableContent: ShareableContent): SocialsShareActionItem[] {
    const shareLinks = this.socialShareService.generateAllSharingLinks(shareableContent);

    return [
      {
        label: 'project.overview.actions.socials.email',
        icon: 'fas fa-envelope',
        url: shareLinks.email,
      },
      {
        label: 'project.overview.actions.socials.x',
        icon: 'fab fa-x-twitter',
        url: shareLinks.twitter,
      },
      {
        label: 'project.overview.actions.socials.linkedIn',
        icon: 'fab fa-linkedin',
        url: shareLinks.linkedIn,
      },
      {
        label: 'project.overview.actions.socials.facebook',
        icon: 'fab fa-facebook-f',
        url: shareLinks.facebook,
      },
    ];
  }
}
