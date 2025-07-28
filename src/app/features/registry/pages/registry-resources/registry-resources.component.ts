import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { finalize, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AddResourceDialogComponent } from '@osf/features/registry/components/add-resource-dialog/add-resource-dialog.component';
import { EditResourceDialogComponent } from '@osf/features/registry/components/edit-resource-dialog/edit-resource-dialog.component';
import { RegistryResource } from '@osf/features/registry/models';
import {
  AddRegistryResource,
  DeleteResource,
  GetRegistryResources,
  RegistryResourcesSelectors,
} from '@osf/features/registry/store/registry-resources';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { CustomConfirmationService, ToastService } from '@shared/services';

@Component({
  selector: 'osf-registry-resources',
  imports: [SubHeaderComponent, TranslatePipe, Button, LoadingSpinnerComponent],
  templateUrl: './registry-resources.component.html',
  styleUrl: './registry-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class RegistryResourcesComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly route = inject(ActivatedRoute);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  private customConfirmationService = inject(CustomConfirmationService);

  protected readonly resources = select(RegistryResourcesSelectors.getResources);
  protected readonly isResourcesLoading = select(RegistryResourcesSelectors.isResourcesLoading);
  private registryId = '';
  protected addingResource = signal(false);

  private readonly actions = createDispatchMap({
    getResources: GetRegistryResources,
    addResource: AddRegistryResource,
    deleteResource: DeleteResource,
  });

  constructor() {
    this.route.parent?.params.subscribe((params) => {
      this.registryId = params['id'];
      if (this.registryId) {
        this.actions.getResources(this.registryId);
      }
    });
  }

  addResource() {
    if (!this.registryId) {
      throw new Error('No registry ID found.');
    }

    this.addingResource.set(true);

    this.actions
      .addResource(this.registryId)
      .pipe(
        take(1),
        finalize(() => this.addingResource.set(false))
      )
      .subscribe(() => {
        const dialogRef = this.dialogService.open(AddResourceDialogComponent, {
          header: this.translateService.instant('resources.add'),
          width: '500px',
          focusOnShow: false,
          closeOnEscape: true,
          modal: true,
          closable: true,
          data: { id: this.registryId },
        });

        dialogRef.onClose.subscribe({
          next: (res) => {
            if (res) {
              this.toastService.showSuccess(
                this.translateService.instant('resources.toastMessages.addResourceSuccess')
              );
            }
          },
          error: () =>
            this.toastService.showError(this.translateService.instant('resources.toastMessages.addResourceError')),
        });
      });
  }

  updateResource(resource: RegistryResource) {
    if (!this.registryId) {
      throw new Error('No registry ID found.');
    }

    const dialogRef = this.dialogService.open(EditResourceDialogComponent, {
      header: this.translateService.instant('resources.edit'),
      width: '500px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: { id: this.registryId, resource: resource },
    });

    dialogRef.onClose.subscribe({
      next: (res) => {
        if (res) {
          this.toastService.showSuccess(
            this.translateService.instant('resources.toastMessages.updatedResourceSuccess')
          );
        }
      },
      error: () =>
        this.toastService.showError(this.translateService.instant('resources.toastMessages.updateResourceError')),
    });
  }

  deleteResource(id: string) {
    if (!this.registryId) return;

    this.customConfirmationService.confirmDelete({
      headerKey: 'resources.delete',
      messageKey: 'resources.deleteText',
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions.deleteResource(id, this.registryId);
      },
    });
  }
}
