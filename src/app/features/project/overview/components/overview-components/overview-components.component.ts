import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { DeleteResourceService } from '@osf/features/project/settings/services/delete-resource.service';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { GetComponents, LoadMoreComponents, ProjectOverviewSelectors, ReorderComponents } from '../../store';
import { AddComponentDialogComponent } from '../add-component-dialog/add-component-dialog.component';
import { ComponentCardComponent } from '../component-card/component-card.component';

@Component({
  selector: 'osf-project-components',
  imports: [Button, CdkDrag, CdkDropList, Skeleton, Tooltip, TranslatePipe, ComponentCardComponent],
  templateUrl: './overview-components.component.html',
  styleUrl: './overview-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponentsComponent {
  private readonly router = inject(Router);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly deleteResourceService = inject(DeleteResourceService);

  readonly canEdit = input.required<boolean>();
  readonly anonymous = input<boolean>(false);

  readonly components = select(ProjectOverviewSelectors.getComponents);
  readonly isComponentsLoading = select(ProjectOverviewSelectors.getComponentsLoading);
  readonly isComponentsSubmitting = select(ProjectOverviewSelectors.getComponentsSubmitting);
  readonly hasMoreComponents = select(ProjectOverviewSelectors.hasMoreComponents);
  readonly project = select(ProjectOverviewSelectors.getProject);
  readonly preventComponentCreation = select(UserSelectors.isProjectCreationDisabled);

  private readonly actions = createDispatchMap({
    getComponents: GetComponents,
    loadMoreComponents: LoadMoreComponents,
    reorderComponents: ReorderComponents,
  });

  readonly reorderedComponents = signal<NodeModel[]>([]);

  readonly isDragDisabled = computed(
    () => this.isComponentsSubmitting() || !this.canEdit() || this.reorderedComponents().length <= 1
  );

  readonly createComponentTooltip = computed(() =>
    this.preventComponentCreation() ? 'project.overview.components.addComponentDisabled' : ''
  );

  constructor() {
    effect(() => {
      const componentsData = this.components();
      this.reorderedComponents.set([...componentsData]);
    });
  }

  handleMenuAction(action: NodeMenuAction, componentId: string): void {
    switch (action) {
      case NodeMenuAction.ManageContributors:
        this.router.navigate([componentId, 'contributors']);
        break;
      case NodeMenuAction.Settings:
        this.router.navigate([componentId, 'settings']);
        break;
      case NodeMenuAction.Delete:
        this.handleDeleteComponent(componentId);
        break;
    }
  }

  handleAddComponent(): void {
    if (this.preventComponentCreation()) return;

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

    const previousComponents = [...this.reorderedComponents()];
    const components = [...previousComponents];
    moveItemInArray(components, event.previousIndex, event.currentIndex);
    this.reorderedComponents.set(components);

    const componentIds = components.map((component) => component.id);
    this.actions.reorderComponents(project.id, componentIds).subscribe({
      next: () => {
        this.toastService.showSuccess('project.overview.dialog.toast.reorderComponents.success');
      },
      error: () => {
        this.reorderedComponents.set(previousComponents);
      },
    });
  }

  private handleDeleteComponent(componentId: string): void {
    const project = this.project();
    if (!project) return;

    this.deleteResourceService.deleteComponent({
      rootParentId: project.rootParentId || project.id,
      resourceId: componentId,
      destroyRef: this.destroyRef,
      onSuccess: () => this.actions.getComponents(project.id),
    });
  }
}
