import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { filter, map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { languageCodes } from '@osf/shared/constants';
import { hasViewOnlyParam } from '@osf/shared/helpers';
import { LanguageCodeModel } from '@osf/shared/models';
import { CustomDialogService } from '@osf/shared/services';

import { FileMetadataFields } from '../../constants';
import { PatchFileMetadata } from '../../models';
import { FilesSelectors, SetFileMetadata } from '../../store';
import { EditFileMetadataDialogComponent } from '../edit-file-metadata-dialog/edit-file-metadata-dialog.component';

@Component({
  selector: 'osf-file-metadata',
  imports: [Button, Skeleton, TranslatePipe],
  templateUrl: './file-metadata.component.html',
  styleUrl: './file-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileMetadataComponent {
  private readonly actions = createDispatchMap({ setFileMetadata: SetFileMetadata });
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly environment = inject(ENVIRONMENT);

  fileMetadata = select(FilesSelectors.getFileCustomMetadata);
  isLoading = select(FilesSelectors.isFileMetadataLoading);
  hasWriteAccess = select(FilesSelectors.hasWriteAccess);
  hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  readonly languageCodes = languageCodes;

  readonly fileGuid = toSignal(this.route.params.pipe(map((params) => params['fileGuid'])) ?? of(undefined));

  metadataFields = FileMetadataFields;

  setFileMetadata(formValues: PatchFileMetadata) {
    const fileId = this.fileMetadata()?.id;

    if (fileId) {
      this.actions.setFileMetadata(formValues, fileId);
    }
  }

  downloadFileMetadata(): void {
    if (this.fileGuid()) {
      window.open(`${this.environment.webUrl}/metadata/${this.fileGuid()}`)?.focus();
    }
  }

  getLanguageName(languageCode: string): string {
    const language = this.languageCodes.find((lang: LanguageCodeModel) => lang.code === languageCode);
    return language ? language.name : languageCode;
  }

  openEditFileMetadataDialog() {
    this.customDialogService
      .open(EditFileMetadataDialogComponent, {
        header: 'files.detail.fileMetadata.edit',
        width: '448px',
        data: this.fileMetadata(),
      })
      .onClose.pipe(filter((res: PatchFileMetadata) => !!res))
      .subscribe((res) => this.setFileMetadata(res));
  }
}
