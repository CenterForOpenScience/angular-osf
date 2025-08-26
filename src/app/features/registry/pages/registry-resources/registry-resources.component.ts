import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { finalize, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IconComponent, LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';

import { AddResourceDialogComponent, EditResourceDialogComponent } from '../../components';
import { RegistryResource } from '../../models';
import {
  AddRegistryResource,
  DeleteResource,
  GetRegistryResources,
  RegistryResourcesSelectors,
  SilentDelete,
} from '../../store/registry-resources';

@Component({
  selector: 'osf-registry-resources',
  imports: [SubHeaderComponent, TranslatePipe, Button, LoadingSpinnerComponent, IconComponent],
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
  private readonly currentResource = select(RegistryResourcesSelectors.getCurrentResource);

  private readonly actions = createDispatchMap({
    getResources: GetRegistryResources,
    addResource: AddRegistryResource,
    deleteResource: DeleteResource,
    silentDelete: SilentDelete,
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
      throw new Error(this.translateService.instant('resources.errors.noRegistryId'));
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
              this.toastService.showSuccess('resources.toastMessages.addResourceSuccess');
            } else {
              const currentResource = this.currentResource();
              if (!currentResource) {
                throw new Error(this.translateService.instant('resources.errors.noCurrentResource'));
              }
              this.actions.silentDelete(currentResource.id);
            }
          },
          error: () => this.toastService.showError('resources.toastMessages.addResourceError'),
        });
      });
  }

  updateResource(resource: RegistryResource) {
    if (!this.registryId) {
      throw new Error(this.translateService.instant('resources.errors.noRegistryId'));
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
          this.toastService.showSuccess('resources.toastMessages.updatedResourceSuccess');
        }
      },
      error: () => this.toastService.showError('resources.toastMessages.updateResourceError'),
    });
  }

  deleteResource(id: string) {
    if (!this.registryId) return;

    this.customConfirmationService.confirmDelete({
      headerKey: 'resources.delete',
      messageKey: 'resources.deleteText',
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteResource(id, this.registryId)
          .pipe(take(1))
          .subscribe(() => {
            this.toastService.showSuccess('resources.toastMessages.deletedResourceSuccess');
          });
      },
    });
  }
}
