import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LANGUAGE_CODES } from '@osf/shared/constants/language.const';
import {
  RESOURCE_TYPE_GENERAL_OPTIONS,
  STUDY_REGISTRATION_RESOURCE_TYPE,
} from '@osf/shared/constants/resource-type-general-options.const';

import { ResourceInformationForm } from '../../models';

@Component({
  selector: 'osf-resource-information-dialog',
  imports: [Button, Select, TranslatePipe, ReactiveFormsModule],
  templateUrl: './resource-information-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceInformationDialogComponent implements OnInit {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly languageOnly = !!this.config.data?.languageOnly;

  resourceForm = new FormGroup<ResourceInformationForm>({
    resourceType: new FormControl(''),
    resourceLanguage: new FormControl(''),
  });

  resourceTypeOptions = RESOURCE_TYPE_GENERAL_OPTIONS;
  languageOptions = LANGUAGE_CODES;

  ngOnInit(): void {
    const metadata = this.config.data?.customItemMetadata;

    this.resourceForm.patchValue({
      resourceType: this.languageOnly ? STUDY_REGISTRATION_RESOURCE_TYPE : metadata?.resourceTypeGeneral || '',
      resourceLanguage: metadata?.language || '',
    });
  }

  save(): void {
    const formValue = this.resourceForm.getRawValue();
    this.dialogRef.close({
      resourceTypeGeneral: this.languageOnly ? STUDY_REGISTRATION_RESOURCE_TYPE : formValue.resourceType,
      language: formValue.resourceLanguage,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
