import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { GetResourceWithChildren } from '@osf/shared/stores/current-resource';

import { LoadMoreComponents, ProjectOverviewSelectors, ReorderComponents } from '../../store';
import { AddComponentDialogComponent } from '../add-component-dialog/add-component-dialog.component';
import { ComponentCardComponent } from '../component-card/component-card.component';
import { DeleteComponentDialogComponent } from '../delete-component-dialog/delete-component-dialog.component';

@Component({
  selector: 'osf-project-components',
  imports: [Button, CdkDrag, CdkDropList, Skeleton, TranslatePipe, ComponentCardComponent],
  templateUrl: './overview-components.component.html',
  styleUrl: './overview-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponentsComponent {
  private router = inject(Router);
  private customDialogService = inject(CustomDialogService);
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastService);

  canEdit = input.required<boolean>();
  anonymous = input<boolean>(false);

  components = select(ProjectOverviewSelectors.getComponents);
  isComponentsLoading = select(ProjectOverviewSelectors.getComponentsLoading);
  isComponentsSubmitting = select(ProjectOverviewSelectors.getComponentsSubmitting);
  hasMoreComponents = select(ProjectOverviewSelectors.hasMoreComponents);
  project = select(ProjectOverviewSelectors.getProject);

  reorderedComponents = signal<NodeModel[]>([]);

  actions = createDispatchMap({
    getComponentsTree: GetResourceWithChildren,
    loadMoreComponents: LoadMoreComponents,
    reorderComponents: ReorderComponents,
  });

  isDragDisabled = computed(
    () => this.isComponentsSubmitting() || (!this.canEdit() && this.reorderedComponents().length <= 1)
  );

  constructor() {
    effect(() => {
      const componentsData = this.components();
      this.reorderedComponents.set([...componentsData]);
    });
  }

  handleMenuAction(action: string, componentId: string): void {
    switch (action) {
      case 'manageContributors':
        this.router.navigate([componentId, 'contributors']);
        break;
      case 'settings':
        this.router.navigate([componentId, 'settings']);
        break;
      case 'delete':
        this.handleDeleteComponent(componentId);
        break;
    }
  }

  handleAddComponent(): void {
    this.customDialogService.open(AddComponentDialogComponent, {
      header: 'project.overview.dialog.addComponent.header',
      width: '850px',
    });
  }

  handleComponentNavigate(componentId: string): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/', componentId], { queryParamsHandling: 'preserve' })
    );

    window.open(url, '_self');
  }

  loadMoreComponents(): void {
    const project = this.project();
    if (!project) return;

    this.actions.loadMoreComponents(project.id);
  }

  onReorder(event: CdkDragDrop<NodeModel[]>): void {
    const project = this.project();
    if (!project || !this.canEdit()) return;

    const components = [...this.reorderedComponents()];
    moveItemInArray(components, event.previousIndex, event.currentIndex);
    this.reorderedComponents.set(components);

    const componentIds = components.map((component) => component.id);
    this.actions.reorderComponents(project.id, componentIds).subscribe({
      next: () => {
        this.toastService.showSuccess('project.overview.dialog.toast.reorderComponents.success');
      },
    });
  }

  private handleDeleteComponent(componentId: string): void {
    const project = this.project();
    if (!project) return;

    this.loaderService.show();

    this.actions.getComponentsTree(project.rootParentId || project.id, componentId, ResourceType.Project).subscribe({
      next: () => {
        this.loaderService.hide();
        this.customDialogService.open(DeleteComponentDialogComponent, {
          header: 'project.overview.dialog.deleteComponent.header',
          width: '650px',
          data: { componentId, resourceType: ResourceType.Project },
        });
      },
      error: () => this.loaderService.hide(),
    });
  }
}
