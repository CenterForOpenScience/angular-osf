import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import { filter, map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ProjectFilesSelectors, SetFileMetadata } from '@osf/features/project/files/store';

import { FileMetadataFields } from '../../constants';
import { PatchFileMetadata } from '../../models';
import { EditFileMetadataDialogComponent } from '../edit-file-metadata-dialog/edit-file-metadata-dialog.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-file-metadata',
  imports: [Button, Skeleton, TranslatePipe],
  templateUrl: './file-metadata.component.html',
  styleUrl: './file-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class FileMetadataComponent {
  private readonly actions = createDispatchMap({ setFileMetadata: SetFileMetadata });
  private readonly route = inject(ActivatedRoute);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  fileMetadata = select(ProjectFilesSelectors.getFileCustomMetadata);
  isLoading = select(ProjectFilesSelectors.isFileMetadataLoading);

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
      window.open(`${environment.webUrl}/${this.fileGuid()}/metadata/?format=datacite-json`)?.focus();
    }
  }

  openEditFileMetadataDialog() {
    this.dialogService
      .open(EditFileMetadataDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('project.files.detail.fileMetadata.edit'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(filter((res: PatchFileMetadata) => !!res))
      .subscribe((res) => this.setFileMetadata(res));
  }
}
