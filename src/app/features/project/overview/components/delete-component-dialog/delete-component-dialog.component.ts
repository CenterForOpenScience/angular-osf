import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { ScientistsNames } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { ToastService } from '@osf/shared/services';

import { DeleteComponent, GetComponents, ProjectOverviewSelectors } from '../../store';

@Component({
  selector: 'osf-delete-component-dialog',
  imports: [TranslatePipe, Button, InputText, FormsModule],
  templateUrl: './delete-component-dialog.component.html',
  styleUrl: './delete-component-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponentDialogComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  private componentId = signal(this.dialogConfig.data.componentId);
  protected scientistNames = ScientistsNames;
  protected project = select(ProjectOverviewSelectors.getProject);
  protected registration = select(RegistryOverviewSelectors.getRegistry);
  protected isSubmitting = select(ProjectOverviewSelectors.getComponentsSubmitting);
  protected userInput = signal('');
  protected selectedScientist = computed(() => {
    const names = Object.values(this.scientistNames);
    return names[Math.floor(Math.random() * names.length)];
  });

  readonly currentResource = computed(() => {
    const resourceType = this.dialogConfig.data.resourceType;

    if (resourceType) {
      if (resourceType === ResourceType.Project) return this.project();

      if (resourceType === ResourceType.Registration) return this.registration();
    }

    return null;
  });

  protected actions = createDispatchMap({
    getComponents: GetComponents,
    deleteComponent: DeleteComponent,
  });

  protected isInputValid(): boolean {
    return this.userInput() === this.selectedScientist();
  }

  protected onInputChange(value: string): void {
    this.userInput.set(value);
  }

  protected handleDeleteComponent(): void {
    const resource = this.currentResource();
    const componentId = this.componentId();

    if (!componentId || !resource) return;

    this.actions
      .deleteComponent(componentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close({ success: true });

          const isForksContext = this.dialogConfig.data.isForksContext;

          if (!isForksContext) {
            this.actions.getComponents(resource.id);
          }
        },
        complete: () => {
          this.toastService.showSuccess('project.overview.dialog.toast.deleteComponent.success');
        },
      });
  }
}
