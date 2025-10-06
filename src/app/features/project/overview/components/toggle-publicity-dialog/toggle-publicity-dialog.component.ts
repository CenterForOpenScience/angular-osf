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

import { ComponentsSelectionListComponent } from '@osf/shared/components';
import { UserPermissions } from '@osf/shared/enums';
import { ComponentCheckboxItemModel } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { CurrentResourceSelectors } from '@osf/shared/stores';

import { TogglePublicityStep } from '../../enums';
import { PrivacyStatusModel } from '../../models/privacy-status.model';
import { ProjectOverviewSelectors, UpdateProjectPublicStatus } from '../../store';

@Component({
  selector: 'osf-toggle-publicity-dialog',
  imports: [Button, TranslatePipe, ComponentsSelectionListComponent],
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

  private projectId = signal(this.dialogConfig.data.projectId);
  isCurrentlyPublic = signal(this.dialogConfig.data.isCurrentlyPublic);
  messageKey = computed(() =>
    this.isCurrentlyPublic()
      ? 'project.overview.dialog.makePrivate.message'
      : 'project.overview.dialog.makePublic.message'
  );

  step: TogglePublicityStep = TogglePublicityStep.Confirmation;

  componentsList: WritableSignal<ComponentCheckboxItemModel[]> = signal([]);

  get isConfirmationStep() {
    return this.step === TogglePublicityStep.Confirmation;
  }

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
    if (this.step === TogglePublicityStep.Confirmation && this.components().length > 1) {
      this.step = TogglePublicityStep.ComponentSelection;
      this.dialogConfig.header = this.translateService.instant('project.overview.dialog.changePrivacySettings');
      return;
    }

    const payload: PrivacyStatusModel[] =
      this.step === TogglePublicityStep.ComponentSelection
        ? this.componentsList().map((item) => ({ id: item.id, public: item.checked }))
        : [{ id: this.projectId(), public: !this.isCurrentlyPublic() }];

    this.actions
      .updateProjectPublicStatus(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastService.showSuccess(
            !this.isCurrentlyPublic()
              ? 'project.overview.dialog.toast.makePublic.success'
              : 'project.overview.dialog.toast.makePrivate.success'
          );
        },
      });
  }
}
