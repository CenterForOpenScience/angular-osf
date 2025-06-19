import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomItemMetadataRecord } from '@osf/features/project/metadata/models';
import { ProjectOverview } from '@osf/features/project/overview/models';
import { LanguageCode, languageCodes } from '@shared/constants/language.const';

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

  // Resource type options - based on common research resource types
  resourceTypeOptions = [
    { label: 'Audiovisual', value: 'audiovisual' },
    { label: 'Book', value: 'book' },
    { label: 'Book Chapter', value: 'book-chapter' },
    { label: 'Collection', value: 'collection' },
    { label: 'Computational Notebook', value: 'computational-notebook' },
    { label: 'Conference Paper', value: 'conference-paper' },
    { label: 'Conference Proceeding', value: 'conference-proceeding' },
    { label: 'Data Paper', value: 'data-paper' },
    { label: 'Dataset', value: 'dataset' },
    { label: 'Dissertation', value: 'dissertation' },
    { label: 'Event', value: 'event' },
    { label: 'Image', value: 'image' },
    { label: 'Interactive Resource', value: 'interactive-resource' },
    { label: 'Journal Article', value: 'journal-article' },
    { label: 'Model', value: 'model' },
    { label: 'Output Management Plan', value: 'output-management-plan' },
    { label: 'Peer Review', value: 'peer-review' },
    { label: 'Physical Object', value: 'physical-object' },
    { label: 'Preprint', value: 'preprint' },
    { label: 'Report', value: 'report' },
    { label: 'Service', value: 'service' },
    { label: 'Software', value: 'software' },
    { label: 'Sound', value: 'sound' },
    { label: 'Standard', value: 'standard' },
    { label: 'Text', value: 'text' },
    { label: 'Thesis', value: 'thesis' },
    { label: 'Workflow', value: 'workflow' },
    { label: 'Other', value: 'other' },
  ];

  // Language options - using shared language constants
  languageOptions = languageCodes.map((lang: LanguageCode) => ({
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
    // Pre-populate the form if editing existing resource information
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
