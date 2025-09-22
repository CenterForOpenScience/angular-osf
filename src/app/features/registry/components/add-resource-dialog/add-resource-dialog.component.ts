import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IconComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { RegistryResourceType } from '@osf/shared/enums';
import { CustomValidators } from '@osf/shared/helpers';
import { SelectOption } from '@osf/shared/models';

import { resourceTypeOptions } from '../../constants';
import { AddResource, ConfirmAddResource, RegistryResourceFormModel } from '../../models';
import {
  ConfirmAddRegistryResource,
  PreviewRegistryResource,
  RegistryResourcesSelectors,
  SilentDelete,
} from '../../store/registry-resources';
import { ResourceFormComponent } from '../resource-form/resource-form.component';

@Component({
  selector: 'osf-add-resource-dialog',
  imports: [Button, TranslatePipe, ReactiveFormsModule, LoadingSpinnerComponent, ResourceFormComponent, IconComponent],
  templateUrl: './add-resource-dialog.component.html',
  styleUrl: './add-resource-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddResourceDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly currentResource = select(RegistryResourcesSelectors.getCurrentResource);
  readonly isCurrentResourceLoading = select(RegistryResourcesSelectors.isCurrentResourceLoading);
  private readonly translateService = inject(TranslateService);

  private dialogConfig = inject(DynamicDialogConfig);
  private registryId: string = this.dialogConfig.data.id;

  doiDomain = 'https://doi.org/';
  inputLimits = InputLimits;
  isResourceConfirming = signal(false);

  doiLink = computed(() => `${this.doiDomain}${this.currentResource()?.pid}`);

  form = new FormGroup<RegistryResourceFormModel>({
    pid: new FormControl<string | null>('', [CustomValidators.requiredTrimmed(), CustomValidators.doiValidator]),
    resourceType: new FormControl<string | null>('', [Validators.required]),
    description: new FormControl<string | null>(''),
  });

  private readonly actions = createDispatchMap({
    previewResource: PreviewRegistryResource,
    confirmAddResource: ConfirmAddRegistryResource,
    deleteResource: SilentDelete,
  });

  public resourceOptions = signal<SelectOption[]>(resourceTypeOptions);
  public isPreviewMode = signal<boolean>(false);

  readonly RegistryResourceType = RegistryResourceType;

  previewResource(): void {
    if (this.form.invalid) {
      return;
    }

    const addResource: AddResource = {
      pid: this.form.controls['pid'].value ?? '',
      resource_type: this.form.controls['resourceType'].value ?? '',
      description: this.form.controls['description'].value ?? '',
    };

    const currentResource = this.currentResource();
    if (!currentResource) {
      throw new Error(this.translateService.instant('resources.errors.noCurrentResource'));
    }

    this.actions.previewResource(currentResource.id, addResource).subscribe(() => this.isPreviewMode.set(true));
  }

  backToEdit() {
    this.isPreviewMode.set(false);
  }

  onAddResource() {
    const addResource: ConfirmAddResource = { finalized: true };
    const currentResource = this.currentResource();

    if (!currentResource) {
      throw new Error(this.translateService.instant('resources.errors.noRegistryId'));
    }

    this.isResourceConfirming.set(true);
    this.actions
      .confirmAddResource(addResource, currentResource.id, this.registryId)
      .pipe(
        take(1),
        finalize(() => {
          this.dialogRef.close(true);
          this.isResourceConfirming.set(false);
        })
      )
      .subscribe({});
  }

  closeDialog(): void {
    this.dialogRef.close();
    const currentResource = this.currentResource();

    if (currentResource) {
      this.actions.deleteResource(currentResource.id);
    }
  }
}
