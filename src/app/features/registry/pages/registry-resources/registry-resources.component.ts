import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { filter, finalize, switchMap, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly resources = select(RegistryResourcesSelectors.getResources);
  readonly isResourcesLoading = select(RegistryResourcesSelectors.isResourcesLoading);
  readonly currentResource = select(RegistryResourcesSelectors.getCurrentResource);

  registryId = '';
  isAddingResource = signal(false);
  doiDomain = 'https://doi.org/';

  private readonly actions = createDispatchMap({
    getResources: GetRegistryResources,
    addResource: AddRegistryResource,
    deleteResource: DeleteResource,
  });

  constructor() {
    this.route.parent?.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.registryId = params['id'];
      if (this.registryId) {
        this.actions.getResources(this.registryId);
      }
    });
  }

  addResource() {
    if (!this.registryId) return;

    this.isAddingResource.set(true);

    this.actions
      .addResource(this.registryId)
      .pipe(
        take(1),
        switchMap(() => this.openAddResourceDialog()),
        filter((res) => !!res),
        finalize(() => this.isAddingResource.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.toastService.showSuccess('resources.toastMessages.addResourceSuccess'),
        error: () => this.toastService.showError('resources.toastMessages.addResourceError'),
      });
  }

  openAddResourceDialog() {
    return this.dialogService.open(AddResourceDialogComponent, {
      header: this.translateService.instant('resources.add'),
      width: '500px',
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: { id: this.registryId },
    }).onClose;
  }

  updateResource(resource: RegistryResource) {
    if (!this.registryId) return;

    this.dialogService
      .open(EditResourceDialogComponent, {
        header: this.translateService.instant('resources.edit'),
        width: '500px',
        focusOnShow: false,
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: { id: this.registryId, resource: resource },
      })
      .onClose.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((res) => !!res)
      )
      .subscribe({
        next: () => this.toastService.showSuccess('resources.toastMessages.updatedResourceSuccess'),
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
          .subscribe(() => this.toastService.showSuccess('resources.toastMessages.deletedResourceSuccess'));
      },
    });
  }
}
