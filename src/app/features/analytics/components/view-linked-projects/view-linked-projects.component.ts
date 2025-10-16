import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
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
import { ActivatedRoute, RouterLink } from '@angular/router';

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
import { ResourceType } from '@osf/shared/enums';
import { ClearLinkedProjects, GetAllLinkedProjects, LinkedProjectsSelectors } from '@shared/stores/linked-projects';

@Component({
  selector: 'osf-view-linked-nodes',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    Button,
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
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private project = select(ProjectOverviewSelectors.getProject);
  private registration = select(RegistryOverviewSelectors.getRegistry);

  linkedProjects = select(LinkedProjectsSelectors.getLinkedProjects);
  isLoading = select(LinkedProjectsSelectors.getLinkedProjectsLoading);
  totalLinkedProjects = select(LinkedProjectsSelectors.getLinkedProjectsTotalCount);

  readonly pageSize = 10;

  currentPage = signal<string>('1');
  firstIndex = computed(() => (parseInt(this.currentPage()) - 1) * this.pageSize);

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
}
