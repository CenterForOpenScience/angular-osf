import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { PaginatorState } from 'primeng/paginator';

import { map, of } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { RelatedItemsType } from '@osf/features/analytics/enums/related-items-type';
import {
  DeleteComponentDialogComponent,
  ForkDialogComponent,
  LinkResourceDialogComponent,
} from '@osf/features/project/overview/components';
import { ClearProjectOverview, GetProjectById, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import {
  ClearRegistryOverview,
  GetRegistryById,
  RegistryOverviewSelectors,
} from '@osf/features/registry/store/registry-overview';
import {
  ContributorsListComponent,
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SubHeaderComponent,
  TruncatedTextComponent,
} from '@osf/shared/components';
import { ResourceType, UserPermissions } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { ToolbarResource } from '@osf/shared/models';
import { Duplicate } from '@osf/shared/models/duplicates';
import { CustomDialogService } from '@osf/shared/services';
import { ClearDuplicates, GetAllDuplicates, GetAllLinkedProjects, RelatedSelectors } from '@osf/shared/stores';

@Component({
  selector: 'osf-view-related-projects',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    Button,
    Menu,
    TruncatedTextComponent,
    DatePipe,
    LoadingSpinnerComponent,
    RouterLink,
    CustomPaginatorComponent,
    IconComponent,
    ContributorsListComponent,
  ],
  templateUrl: './view-related-projects.component.html',
  styleUrl: './view-related-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewRelatedProjectsComponent implements OnInit {
  private customDialogService = inject(CustomDialogService);
  private loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private translateService = inject(TranslateService);
  private project = select(ProjectOverviewSelectors.getProject);
  private registration = select(RegistryOverviewSelectors.getRegistry);
  private isProjectAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  private isRegistryAnonymous = select(RegistryOverviewSelectors.isRegistryAnonymous);
  private itemType = signal<RelatedItemsType | null>(null);

  items = select(RelatedSelectors.getRelated);
  isLoading = select(RelatedSelectors.getRelatedLoading);
  totalDuplicates = select(RelatedSelectors.getRelatedTotalCount);
  isAuthenticated = select(UserSelectors.isAuthenticated);
  isMedium = toSignal(inject(IS_MEDIUM));

  title = computed(() => {
    switch (this.itemType()) {
      case RelatedItemsType.Duplicates:
        return this.translateService.instant('project.analytics.kpi.forks');
      case RelatedItemsType.Linked:
        return this.translateService.instant('project.analytics.viewRelated.linkedProjectsTitle');
    }
  });

  emptyScreenMessage = computed(() => {
    switch (this.itemType()) {
      case RelatedItemsType.Duplicates:
        return this.translateService.instant('project.overview.dialog.fork.noForksMessage');
      case RelatedItemsType.Linked:
        return this.translateService.instant('project.analytics.viewRelated.noLinkedProjectsMessage');
    }
  });

  message = computed(() => {
    switch (this.itemType()) {
      case RelatedItemsType.Duplicates:
        return this.translateService.instant('project.overview.dialog.fork.forksMessage');
      case RelatedItemsType.Linked:
        return this.translateService.instant('project.analytics.viewRelated.linkedProjectsMessage');
    }
  });

  mainActionMessage = computed(() => {
    switch (this.itemType()) {
      case RelatedItemsType.Duplicates:
        return this.translateService.instant('project.overview.actions.forkProjectLabel');
      case RelatedItemsType.Linked:
        return this.translateService.instant('project.overview.components.linkProjectsButton');
    }
  });

  readonly pageSize = 10;
  readonly UserPermissions = UserPermissions;

  currentPage = signal<string>('1');
  firstIndex = computed(() => (parseInt(this.currentPage()) - 1) * this.pageSize);

  readonly forkActionItems = (resourceId: string) => [
    {
      label: 'project.overview.actions.manageContributors',
      action: 'manageContributors',
      resourceId,
    },
    {
      label: 'project.overview.actions.settings',
      action: 'settings',
      resourceId,
    },
    {
      label: 'project.overview.actions.delete',
      action: 'delete',
      resourceId,
    },
  ];

  readonly resourceId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );
  readonly currentResource = computed(() => {
    const resourceType = this.resourceType();

    if (resourceType) {
      if (resourceType === ResourceType.Project) return this.project();

      if (resourceType === ResourceType.Registration) return this.registration();
    }

    return null;
  });

  actions = createDispatchMap({
    getProject: GetProjectById,
    getRegistration: GetRegistryById,
    getDuplicates: GetAllDuplicates,
    getLinkedProjects: GetAllLinkedProjects,
    clearDuplicates: ClearDuplicates,
    clearProject: ClearProjectOverview,
    clearRegistration: ClearRegistryOverview,
    getComponentsTree: GetResourceWithChildren,
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.itemType.set((params.get('type') as RelatedItemsType) ?? RelatedItemsType.Duplicates);
    });
  }

  constructor() {
    effect(() => {
      const resourceId = this.resourceId();
      const resourceType = this.resourceType();

      if (resourceId) {
        if (resourceType === ResourceType.Project) this.actions.getProject(resourceId);
        if (resourceType === ResourceType.Registration) this.actions.getRegistration(resourceId);
      }
    });

    effect(() => {
      const resource = this.currentResource();
      if (!resource) {
        return;
      }
      switch (this.itemType()) {
        case RelatedItemsType.Duplicates:
          this.actions.getDuplicates(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
          break;
        case RelatedItemsType.Linked:
          this.actions.getLinkedProjects(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
          break;
      }
    });

    this.setupCleanup();
  }

  toolbarResource = computed(() => {
    const resource = this.currentResource();
    const resourceType = this.resourceType();
    if (resource && resourceType) {
      const isAnonymous =
        resourceType === ResourceType.Project ? this.isProjectAnonymous() : this.isRegistryAnonymous();

      return {
        id: resource.id,
        isPublic: resource.isPublic,
        storage: undefined,
        viewOnlyLinksCount: 0,
        forksCount: resource.forksCount,
        resourceType: resourceType,
        isAnonymous,
      } as ToolbarResource;
    }
    return null;
  });

  showMoreOptions(duplicate: Duplicate) {
    return (
      this.isShowingDuplicates() &&
      (duplicate.currentUserPermissions.includes(UserPermissions.Admin) ||
        duplicate.currentUserPermissions.includes(UserPermissions.Write))
    );
  }

  isShowingDuplicates() {
    return this.itemType() == RelatedItemsType.Duplicates;
  }

  handleMenuAction(action: string, resourceId: string): void {
    switch (action) {
      case 'manageContributors':
        this.router.navigate([resourceId, 'contributors']);
        break;
      case 'settings':
        this.router.navigate([resourceId, 'settings']);
        break;
      case 'delete':
        this.handleDeleteFork(resourceId);
        break;
    }
  }
  handleMainAction() {
    switch (this.itemType()) {
      case RelatedItemsType.Duplicates:
        this.handleForkResource();
        return;

      case RelatedItemsType.Linked:
        this.openLinkProjectModal();
        return;
    }
  }

  openLinkProjectModal() {
    const dialogWidth = this.isMedium() ? '850px' : '95vw';

    this.customDialogService.open(LinkResourceDialogComponent, {
      header: 'project.overview.dialog.linkProject.header',
      width: dialogWidth,
    });
  }

  handleForkResource(): void {
    const toolbarResource = this.toolbarResource();

    if (toolbarResource) {
      this.customDialogService
        .open(ForkDialogComponent, {
          header: 'project.overview.dialog.fork.headerProject',
          width: '450px',
          data: {
            resource: toolbarResource,
            resourceType: this.resourceType(),
          },
        })
        .onClose.subscribe((result) => {
          if (result?.success) {
            const resource = this.currentResource();
            if (resource) {
              this.actions.getDuplicates(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
            }
          }
        });
    }
  }

  onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) {
      const pageNumber = (event.page + 1).toString();
      this.currentPage.set(pageNumber);
    }
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearDuplicates();
      this.actions.clearProject();
      this.actions.clearRegistration();
    });
  }

  private handleDeleteFork(id: string): void {
    const resourceType = this.resourceType();
    if (!resourceType) return;

    this.loaderService.show();

    this.actions.getComponentsTree(id, id, resourceType).subscribe({
      next: () => {
        this.loaderService.hide();
        this.customDialogService
          .open(DeleteComponentDialogComponent, {
            header: 'project.overview.dialog.deleteComponent.header',
            width: '650px',
            data: {
              componentId: id,
              resourceType: resourceType,
              isForksContext: true,
              currentPage: parseInt(this.currentPage()),
              pageSize: this.pageSize,
            },
          })
          .onClose.subscribe((result) => {
            if (result?.success) {
              const resource = this.currentResource();
              if (resource) {
                this.actions.getDuplicates(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
              }
            }
          });
      },
      error: () => {
        this.loaderService.hide();
      },
    });
  }
}
