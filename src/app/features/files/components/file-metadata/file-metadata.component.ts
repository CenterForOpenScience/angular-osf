import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { filter, map } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { LanguageLabelPipe } from '@osf/shared/pipes/language-label.pipe';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { MetadataRecordsService } from '@osf/shared/services/metadata-records.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { FileMetadataFields } from '../../constants';
import { PatchFileMetadata } from '../../models/patch-file-metadata.model';
import { FilesSelectors, SetFileMetadata } from '../../store';
import { EditFileMetadataDialogComponent } from '../edit-file-metadata-dialog/edit-file-metadata-dialog.component';

@Component({
  selector: 'osf-file-metadata',
  imports: [Button, Skeleton, LanguageLabelPipe, TranslatePipe],
  templateUrl: './file-metadata.component.html',
  styleUrl: './file-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileMetadataComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly metadataRecordsService = inject(MetadataRecordsService);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);

  private readonly actions = createDispatchMap({ setFileMetadata: SetFileMetadata });

  readonly fileMetadata = select(FilesSelectors.getFileCustomMetadata);
  readonly isLoading = select(FilesSelectors.isFileMetadataLoading);
  readonly hasWriteAccess = select(FilesSelectors.hasWriteAccess);

  readonly hasViewOnly = this.viewOnlyService.hasViewOnlyParam(this.router);

  readonly fileGuid = toSignal(this.route.params.pipe(map((params) => params['fileGuid'])));

  readonly metadataFields = FileMetadataFields;

  downloadFileMetadata(): void {
    const fileGuid = this.fileGuid();

    if (fileGuid) {
      this.metadataRecordsService.downloadMetadata(fileGuid);
    }
  }

  openEditFileMetadataDialog() {
    this.customDialogService
      .open(EditFileMetadataDialogComponent, {
        header: 'common.labels.edit',
        width: '448px',
        data: this.fileMetadata(),
      })
      .onClose.pipe(
        filter((res: PatchFileMetadata) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => this.setFileMetadata(res));
  }

  setFileMetadata(formValues: PatchFileMetadata) {
    const fileId = this.fileMetadata()?.id;

    if (fileId) {
      this.actions.setFileMetadata(formValues, fileId);
    }
  }
}
