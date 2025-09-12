import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { languageCodes } from '@osf/shared/constants';
import { LanguageCodeModel } from '@osf/shared/models';

import { RESOURCE_TYPE_OPTIONS } from '../../constants';
import { CustomItemMetadataRecord, ResourceInformationForm } from '../../models';

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
    resourceType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    resourceLanguage: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  resourceTypeOptions = RESOURCE_TYPE_OPTIONS;
  languageOptions = languageCodes.map((lang: LanguageCodeModel) => ({
    label: lang.name,
    value: lang.code,
  }));

  get customItemMetadata(): CustomItemMetadataRecord | null {
    return this.config.data?.customItemMetadata || null;
  }

  get isEditMode(): boolean {
    return !!this.customItemMetadata;
  }

  getResourceTypeName(resourceType: string): string {
    return Object.fromEntries(RESOURCE_TYPE_OPTIONS.map((item) => [item.value, item.label]))[resourceType];
  }

  ngOnInit(): void {
    const metadata = this.customItemMetadata;
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
