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
import { DeleteComponentDialogComponent } from '@osf/features/project/overview/components';
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
import { CustomDialogService, LoaderService } from '@osf/shared/services';
import { GetResourceWithChildren } from '@osf/shared/stores';
import { ClearLinkedProjects, GetAllLinkedProjects, LinkedProjectsSelectors } from '@shared/stores/linked-projects';

@Component({
  selector: 'osf-view-linked-nodes',
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
  templateUrl: './view-linked-projects.component.html',
  styleUrl: './view-linked-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewLinkedProjectsComponent {
  private customDialogService = inject(CustomDialogService);
  private loaderService = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private project = select(ProjectOverviewSelectors.getProject);
  private registration = select(RegistryOverviewSelectors.getRegistry);
  private isProjectAnonymous = select(ProjectOverviewSelectors.isProjectAnonymous);
  private isRegistryAnonymous = select(RegistryOverviewSelectors.isRegistryAnonymous);

  duplicates = select(LinkedProjectsSelectors.getLinkedProjects);
  isDuplicatesLoading = select(LinkedProjectsSelectors.getLinkedProjectsLoading);
  totalDuplicates = select(LinkedProjectsSelectors.getLinkedProjectsTotalCount);
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
    getLinkedProjects: GetAllLinkedProjects,
    clearLinkedProjects: ClearLinkedProjects,
    clearProject: ClearProjectOverview,
    clearRegistration: ClearRegistryOverview,
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
        this.actions.getLinkedProjects(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
      }
    });

    this.setupCleanup();
  }

  onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) {
      const pageNumber = (event.page + 1).toString();
      this.currentPage.set(pageNumber);
    }
  }

  setupCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.actions.clearLinkedProjects();
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
                this.actions.getLinkedProjects(resource.id, resource.type, parseInt(this.currentPage()), this.pageSize);
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
