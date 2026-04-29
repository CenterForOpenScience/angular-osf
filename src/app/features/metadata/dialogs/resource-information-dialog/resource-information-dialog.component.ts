import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LANGUAGE_CODES } from '@osf/shared/constants/language.const';
import { RESOURCE_TYPE_GENERAL_OPTIONS } from '@osf/shared/constants/resource-type-general-options.const';

import { ResourceInformationForm } from '../../models';

@Component({
  selector: 'osf-resource-information-dialog',
  imports: [Button, Select, TranslatePipe, ReactiveFormsModule],
  templateUrl: './resource-information-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceInformationDialogComponent implements OnInit {
  dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  resourceForm = new FormGroup<ResourceInformationForm>({
    resourceType: new FormControl(''),
    resourceLanguage: new FormControl(''),
  });

  resourceTypeOptions = RESOURCE_TYPE_GENERAL_OPTIONS;
  languageOptions = LANGUAGE_CODES;

  ngOnInit(): void {
    const metadata = this.config.data?.customItemMetadata;

    if (metadata) {
      this.resourceForm.patchValue({
        resourceType: metadata.resourceTypeGeneral || '',
        resourceLanguage: metadata.language || '',
      });
    }
  }

  save(): void {
    if (this.resourceForm.valid) {
      const formValue = this.resourceForm.getRawValue();
      this.dialogRef.close({
        resourceTypeGeneral: formValue.resourceType,
        language: formValue.resourceLanguage,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
