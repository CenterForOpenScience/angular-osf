import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

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
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { DeleteComponentDialogComponent, ForkDialogComponent } from '@osf/features/project/overview/components';
import { ClearProjectOverview, GetProjectById, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ClearRegistry, GetRegistryById, RegistrySelectors } from '@osf/features/registry/store/registry';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { GetResourceWithChildren } from '@osf/shared/stores/current-resource';
import { ClearDuplicates, DuplicatesSelectors, GetAllDuplicates } from '@osf/shared/stores/duplicates';
import { BaseNodeModel } from '@shared/models/nodes/base-node.model';
import { ToolbarResource } from '@shared/models/toolbar-resource.model';

@Component({
  selector: 'osf-view-duplicates',
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
    DatePipe,
  ],
  templateUrl: './view-duplicates.component.html',
  styleUrl: './view-duplicates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDuplicatesComponent {
  private customDialogService = inject(CustomDialogService);
  private loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private project = select(ProjectOverviewSelectors.getProject);
  private registration = select(RegistrySelectors.getRegistry);
  private isProjectAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  private isRegistryAnonymous = select(RegistrySelectors.isRegistryAnonymous);

  duplicates = select(DuplicatesSelectors.getDuplicates);
  isDuplicatesLoading = select(DuplicatesSelectors.getDuplicatesLoading);
  totalDuplicates = select(DuplicatesSelectors.getDuplicatesTotalCount);
  isAuthenticated = select(UserSelectors.isAuthenticated);

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
    clearDuplicates: ClearDuplicates,
    clearProject: ClearProjectOverview,
    clearRegistration: ClearRegistry,
    getComponentsTree: GetResourceWithChildren,
  });

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

      if (resource) {
        this.actions.getDuplicates(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
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

  showMoreOptions(duplicate: BaseNodeModel) {
    return (
      duplicate.currentUserPermissions.includes(UserPermissions.Admin) ||
      duplicate.currentUserPermissions.includes(UserPermissions.Write)
    );
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
