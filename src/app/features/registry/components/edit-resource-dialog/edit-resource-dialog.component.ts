import { createDispatchMap, select } from '@ngxs/store';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LoadingSpinnerComponent } from '@osf/shared/components';
import { CustomValidators } from '@osf/shared/helpers';

import { AddResource, RegistryResource } from '../../models';
import { RegistryResourcesSelectors, UpdateResource } from '../../store/registry-resources';
import { ResourceFormComponent } from '../resource-form/resource-form.component';

@Component({
  selector: 'osf-edit-resource-dialog',
  imports: [LoadingSpinnerComponent, ReactiveFormsModule, ResourceFormComponent],
  templateUrl: './edit-resource-dialog.component.html',
  styleUrl: './edit-resource-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditResourceDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly isCurrentResourceLoading = select(RegistryResourcesSelectors.isCurrentResourceLoading);

  private dialogConfig = inject(DynamicDialogConfig);
  private registryId: string = this.dialogConfig.data.id;
  private resource: RegistryResource = this.dialogConfig.data.resource as RegistryResource;

  form = new FormGroup({
    pid: new FormControl<string | null>('', [CustomValidators.requiredTrimmed(), CustomValidators.doiValidator]),
    resourceType: new FormControl<string | null>('', [Validators.required]),
    description: new FormControl<string | null>(''),
  });

  private readonly actions = createDispatchMap({ updateResource: UpdateResource });

  constructor() {
    this.form.patchValue({
      pid: this.resource.pid || '',
      resourceType: this.resource.type || '',
      description: this.resource.description || '',
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const addResource: AddResource = {
      pid: this.form.controls['pid'].value ?? '',
      resource_type: this.form.controls['resourceType'].value ?? '',
      description: this.form.controls['description'].value ?? '',
    };

    this.actions
      .updateResource(this.registryId, this.resource.id, addResource)
      .pipe(
        take(1),
        finalize(() => {
          this.dialogRef.close(true);
        })
      )
      .subscribe();
  }
}
