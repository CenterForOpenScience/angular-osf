import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { resourceLanguages, resourceTypes } from '@osf/shared/constants';

import { PatchFileMetadata } from '../../models';

@Component({
  selector: 'osf-edit-file-metadata-dialog',
  imports: [Button, InputText, Select, ReactiveFormsModule, TranslatePipe],
  templateUrl: './edit-file-metadata-dialog.component.html',
  styleUrl: './edit-file-metadata-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFileMetadataDialogComponent {
  protected readonly resourceTypes = resourceTypes;
  protected readonly languages = resourceLanguages;

  private readonly dialogRef = inject(DynamicDialogRef);

  fileMetadataForm = new FormGroup({
    title: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    resourceType: new FormControl<string | null>(null),
    resourceLanguage: new FormControl<string | null>(null),
  });

  get titleControl(): FormControl<string | null> {
    return this.fileMetadataForm.get('title') as FormControl<string | null>;
  }

  get descriptionControl(): FormControl<string | null> {
    return this.fileMetadataForm.get('description') as FormControl<string | null>;
  }

  get resourceTypeControl(): FormControl<string | null> {
    return this.fileMetadataForm.get('resourceType') as FormControl<string | null>;
  }

  get resourceLanguageControl(): FormControl<string | null> {
    return this.fileMetadataForm.get('resourceLanguage') as FormControl<string | null>;
  }

  setFileMetadata() {
    if (this.fileMetadataForm.invalid) {
      return;
    }

    const formValues: PatchFileMetadata = {
      title: this.fileMetadataForm.get('title')?.value ?? null,
      description: this.fileMetadataForm.get('description')?.value ?? null,
      resource_type_general: this.fileMetadataForm.get('resourceType')?.value ?? null,
      language: this.fileMetadataForm.get('resourceLanguage')?.value ?? null,
    };

    this.dialogRef.close(formValues);
  }

  cancel() {
    this.dialogRef.close();
  }
}
