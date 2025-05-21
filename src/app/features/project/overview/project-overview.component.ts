import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  AddProjectToBookmarks,
  CollectionsSelectors,
  GetBookmarksCollectionId,
  RemoveProjectFromBookmarks,
} from '@osf/features/collections/store';
import { GetMyBookmarks, MyProjectsSelectors } from '@osf/features/my-projects/store';
import { AddComponentDialogComponent } from '@osf/features/project/overview/components/add-component-dialog/add-component-dialog.component';
import { DeleteComponentDialogComponent } from '@osf/features/project/overview/components/delete-component-dialog/delete-component-dialog.component';
import { DuplicateDialogComponent } from '@osf/features/project/overview/components/duplicate-dialog/duplicate-dialog.component';
import { ForkDialogComponent } from '@osf/features/project/overview/components/fork-dialog/fork-dialog.component';
import { TogglePublicityDialogComponent } from '@osf/features/project/overview/components/toggle-publicity-dialog/toggle-publicity-dialog.component';
import { ClearWiki, GetHomeWiki, WikiSelectors } from '@osf/features/project/wiki/store';
import { LoadingSpinnerComponent } from '@shared/components';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { TruncatedTextComponent } from '@shared/components/truncated-text/truncated-text.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

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
    TruncatedTextComponent,
    SubHeaderComponent,
    DatePipe,
    RouterLink,
    ToggleSwitch,
    FormsModule,
    Menu,
    TranslatePipe,
    Tooltip,
    LoadingSpinnerComponent,
    NgOptimizedImage,
    Skeleton,
  ],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column w-full h-full';

  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);

  protected isLoading = signal(false);
  protected isMobile = toSignal(inject(IS_XSMALL));
  protected projectId = signal<string | null>(null);

  protected currentProject = select(ProjectOverviewSelectors.getProject);
  protected bookmarksCollectionId = select(CollectionsSelectors.getBookmarksCollectionId);
  protected bookmarkedProjects = select(MyProjectsSelectors.getBookmarks);
  protected components = select(ProjectOverviewSelectors.getComponents);
  protected linkedProjects = select(ProjectOverviewSelectors.getLinkedProjects);
  protected wikiContent = select(WikiSelectors.getHomeWikiContent);

  protected isBookmarksLoading = select(MyProjectsSelectors.getBookmarksLoading);
  protected isBookmarksSubmitting = select(CollectionsSelectors.getBookmarksCollectionIdSubmitting);
  protected isProjectLoading = select(ProjectOverviewSelectors.getProjectLoading);
  protected isWikiLoading = select(WikiSelectors.getHomeWikiLoading);
  protected isComponentsLoading = select(ProjectOverviewSelectors.getComponentsLoading);
  protected isLinkedProjectsLoading = select(ProjectOverviewSelectors.getLinkedProjectsLoading);

  protected isPublic = signal(false);
  protected isBookmarked = computed(() => {
    const project = this.currentProject();
    const bookmarks = this.bookmarkedProjects();

    if (!project || !bookmarks?.length) {
      return false;
    }

    return bookmarks.some((bookmark) => bookmark.id === project.id);
  });

  protected readonly componentActionItems = (componentId: string) => [
    {
      label: 'project.overview.actions.manageContributors',
      command: () => this.router.navigate(['/my-projects', componentId, 'contributors']),
    },
    {
      label: 'project.overview.actions.settings',
      command: () => this.router.navigate(['/my-projects', componentId, 'settings']),
    },
    {
      label: 'project.overview.actions.delete',
      command: () => this.handleDeleteComponent(componentId),
    },
  ];

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
    this.setupCleanup();

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

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.params['id'];
    if (id) {
      this.projectId.set(id);
      this.store.dispatch(new GetProjectById(id));
      this.store.dispatch(new GetBookmarksCollectionId());
      this.store.dispatch(new GetHomeWiki(id));
      this.store.dispatch(new GetComponents(id));
      this.store.dispatch(new GetLinkedProjects(id));
    }
  }

  handleAddComponent(): void {
    const dialogWidth = this.isMobile() ? '95vw' : '850px';

    this.dialogService.open(AddComponentDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.addComponent.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  private handleDeleteComponent(componentId: string): void {
    const dialogWidth = this.isMobile() ? '95vw' : '650px';

    this.dialogService.open(DeleteComponentDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.deleteComponent.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        componentId,
      },
    });
  }

  private handleForkProject(): void {
    this.dialogService
      .open(ForkDialogComponent, {
        focusOnShow: false,
        header: this.translateService.instant('project.overview.dialog.fork.header'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.subscribe((result: boolean) => {
        if (result) {
          const projectId = this.projectId();
          if (projectId) {
            this.store.dispatch(new GetProjectById(projectId));
          }
        }
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

  private setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.store.dispatch(new ClearProjectOverview());
      this.store.dispatch(new ClearWiki());
    });
  }
}
