import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { DeleteProject, SettingsSelectors } from '@osf/features/project/settings/store';
import { RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { ScientistsNames } from '@osf/shared/constants/scientists.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { GetComponents, ProjectOverviewSelectors } from '../../store';

@Component({
  selector: 'osf-delete-component-dialog',
  imports: [TranslatePipe, Button, InputText, FormsModule, Skeleton],
  templateUrl: './delete-component-dialog.component.html',
  styleUrl: './delete-component-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponentDialogComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);

  dialogRef = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);

  scientistNames = ScientistsNames;

  project = select(ProjectOverviewSelectors.getProject);
  registration = select(RegistryOverviewSelectors.getRegistry);
  isSubmitting = select(SettingsSelectors.isSettingsSubmitting);
  isLoading = select(CurrentResourceSelectors.isResourceWithChildrenLoading);
  components = select(CurrentResourceSelectors.getResourceWithChildren);
  userInput = signal('');

  selectedScientist = computed(() => {
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

  hasAdminAccessForAllComponents = computed(() => {
    const components = this.components();
    if (!components || !components.length) return false;

    return components.every((component) => component.permissions?.includes(UserPermissions.Admin));
  });

  hasSubcomponents = computed(() => {
    const components = this.components();
    return components && components.length > 1;
  });

  actions = createDispatchMap({
    getComponents: GetComponents,
    deleteComponent: DeleteProject,
  });

  isInputValid(): boolean {
    return this.userInput() === this.selectedScientist();
  }

  onInputChange(value: string): void {
    this.userInput.set(value);
  }

  handleDeleteComponent(): void {
    const components = this.components();

    if (!components?.length) return;

    this.actions
      .deleteComponent(components)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close({ success: true });

          const isForksContext = this.dialogConfig.data.isForksContext;
          const resource = this.currentResource();

          if (!isForksContext && resource) {
            this.actions.getComponents(resource.id);
          }

          this.toastService.showSuccess('project.overview.dialog.toast.deleteComponent.success');
        },
      });
  }
}
