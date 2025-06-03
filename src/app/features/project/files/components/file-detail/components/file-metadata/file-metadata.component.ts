import { select, Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectFilesSelectors, SetFileMetadata } from '@osf/features/project/files/store';

import { LANGUAGES, RESOURCE_TYPES } from '../../constants/files-details.constants';

@Component({
  selector: 'osf-file-metadata',
  standalone: true,
  imports: [Button, Dialog, InputText, Select, FormsModule, ReactiveFormsModule, Skeleton, TranslateModule],
  templateUrl: './file-metadata.component.html',
  styleUrl: './file-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileMetadataComponent {
  readonly store = inject(Store);
  readonly destroyRef = inject(DestroyRef);
  readonly fb = inject(FormBuilder);

  fileMetadata = select(ProjectFilesSelectors.getFileCustomMetadata);
  isIframeLoading = true;
  editFileMetadataVisible = false;

  fileMetadataForm = new FormGroup({
    title: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    resourceType: new FormControl<string | null>(null),
    resourceLanguage: new FormControl<string | null>(null),
  });

  protected readonly resourceTypes = RESOURCE_TYPES;
  protected readonly languages = LANGUAGES;

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

  constructor() {
    toObservable(this.fileMetadata)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((metadata) => {
        if (metadata.data) {
          this.fileMetadataForm.patchValue({
            title: metadata.data.title,
            description: metadata.data.description,
            resourceType: metadata.data.resourceTypeGeneral,
            resourceLanguage: metadata.data.language,
          });
        }
      });
  }

  setFileMetadata() {
    if (this.fileMetadataForm.valid) {
      const formValues = {
        title: this.fileMetadataForm.get('title')?.value ?? null,
        description: this.fileMetadataForm.get('description')?.value ?? null,
        resource_type_general: this.fileMetadataForm.get('resourceType')?.value ?? null,
        language: this.fileMetadataForm.get('resourceLanguage')?.value ?? null,
      };

      const fileId = this.fileMetadata().data?.id;
      if (fileId) {
        this.store.dispatch(new SetFileMetadata(formValues, fileId));
      }

      this.editFileMetadataVisible = false;
    }
  }
}
