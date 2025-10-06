import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { forkJoin, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CreateCollectionSubmission } from '@osf/features/collections/store/add-to-collection/add-to-collection.actions';
import { UpdateProjectPublicStatus } from '@osf/features/project/overview/store';
import { ToastService } from '@shared/services';

@Component({
  selector: 'osf-add-to-collection-confirmation-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './add-to-collection-confirmation-dialog.component.html',
  styleUrl: './add-to-collection-confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionConfirmationDialogComponent {
  private toastService = inject(ToastService);
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  destroyRef = inject(DestroyRef);
  isSubmitting = signal<boolean>(false);
  actions = createDispatchMap({
    createCollectionSubmission: CreateCollectionSubmission,
    updateProjectPublicStatus: UpdateProjectPublicStatus,
  });

  handleAddToCollectionConfirm(): void {
    const payload = this.config.data.payload;
    const project = this.config.data.project;

    if (!payload || !project) return;

    this.isSubmitting.set(true);
    const projectPayload = [{ id: project.id as string, public: true }];

    const updatePublicStatus$ = project.isPublic ? of(null) : this.actions.updateProjectPublicStatus(projectPayload);

    const createSubmission$ = this.actions.createCollectionSubmission(payload);

    forkJoin({
      publicStatusUpdate: updatePublicStatus$,
      collectionSubmission: createSubmission$,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.dialogRef.close(true);
          this.toastService.showSuccess('collections.addToCollection.confirmationDialogToastMessage');
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
