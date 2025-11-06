import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ComponentsSelectionListComponent } from '@osf/shared/components/components-selection-list/components-selection-list.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { ComponentCheckboxItemModel } from '@shared/models/component-checkbox-item.model';

import { TogglePublicityStep } from '../../enums';
import { PrivacyStatusModel } from '../../models';
import { ProjectOverviewSelectors, UpdateProjectPublicStatus } from '../../store';

@Component({
  selector: 'osf-toggle-publicity-dialog',
  imports: [Button, TranslatePipe, ComponentsSelectionListComponent, LoadingSpinnerComponent],
  templateUrl: './toggle-publicity-dialog.component.html',
  styleUrl: './toggle-publicity-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TogglePublicityDialogComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);

  dialogRef = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);
  isSubmitting = select(ProjectOverviewSelectors.getUpdatePublicStatusSubmitting);
  components = select(CurrentResourceSelectors.getResourceWithChildren);

  actions = createDispatchMap({ updateProjectPublicStatus: UpdateProjectPublicStatus });

  projectId = signal(this.dialogConfig.data.projectId);
  isCurrentlyPublic = signal(this.dialogConfig.data.isCurrentlyPublic);

  messageKey = computed(() =>
    this.isCurrentlyPublic()
      ? 'project.overview.dialog.makePrivate.message'
      : 'project.overview.dialog.makePublic.message'
  );

  step = signal(TogglePublicityStep.Information);
  componentsList: WritableSignal<ComponentCheckboxItemModel[]> = signal([]);

  isInformationStep = computed(() => this.step() === TogglePublicityStep.Information);

  constructor() {
    effect(() => {
      const components = this.components();

      const items: ComponentCheckboxItemModel[] = components.map((item) => ({
        id: item.id,
        title: item.title,
        isCurrent: this.projectId() === item.id,
        parentId: item.parentId,
        checked: item.isPublic,
        disabled: !item.permissions.includes(UserPermissions.Admin),
      }));

      this.componentsList.set(items);
    });
  }

  toggleProjectPublicity() {
    if (this.isInformationStep() && this.components().length > 1) {
      this.step.set(TogglePublicityStep.Selection);
      this.dialogConfig.header = this.translateService.instant('project.overview.dialog.changePrivacySettings');
      return;
    }

    const payload: PrivacyStatusModel[] = !this.isInformationStep()
      ? this.componentsList()
          .filter((item) => !item.disabled)
          .map((item) => ({ id: item.id, public: item.checked }))
      : [{ id: this.projectId(), public: !this.isCurrentlyPublic() }];

    this.actions
      .updateProjectPublicStatus(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastService.showSuccess('project.overview.dialog.toast.changePrivacySettings.success');
        },
      });
  }
}
