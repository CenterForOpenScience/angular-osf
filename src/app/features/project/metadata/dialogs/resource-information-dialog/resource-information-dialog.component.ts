import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RESOURCE_TYPE_OPTIONS } from '@osf/features/project/metadata/constants';
import { CustomItemMetadataRecord } from '@osf/features/project/metadata/models';
import { ProjectOverview } from '@osf/features/project/overview/models';
import { languageCodes } from '@shared/constants';
import { LanguageCodeModel } from '@shared/models';

interface ResourceInformationForm {
  resourceType: FormControl<string>;
  resourceLanguage: FormControl<string>;
}

@Component({
  selector: 'osf-resource-information-dialog',
  imports: [Button, Select, TranslatePipe, ReactiveFormsModule],
  templateUrl: './resource-information-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceInformationDialogComponent implements OnInit {
  protected dialogRef = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);

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

  get currentProject(): ProjectOverview | null {
    return this.config.data?.currentProject || null;
  }

  get customItemMetadata(): CustomItemMetadataRecord | null {
    return this.config.data?.customItemMetadata || null;
  }

  get isEditMode(): boolean {
    return !!this.customItemMetadata;
  }

  ngOnInit(): void {
    const metadata = this.customItemMetadata;
    if (metadata) {
      this.resourceForm.patchValue({
        resourceType: metadata.resource_type_general || '',
        resourceLanguage: metadata.language || '',
      });
    }
  }

  save(): void {
    if (this.resourceForm.valid) {
      const formValue = this.resourceForm.getRawValue();
      this.dialogRef.close({
        resourceType: formValue.resourceType,
        resourceLanguage: formValue.resourceLanguage,
        projectId: this.currentProject?.id,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
