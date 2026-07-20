import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileModel } from '@osf/shared/models/files/file.model';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { FilesService } from '@osf/shared/services/files.service';

import { FileDownloadContext } from '../models/files/file-download-context.model';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  private readonly dataciteService = inject(DataciteService);
  private readonly filesService = inject(FilesService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  downloadFolderAsZip({ resourceId, resourceType, downloadLink }: FileDownloadContext): void {
    if (!resourceId || !downloadLink) {
      return;
    }

    this.dataciteService.logFileDownload(resourceId, resourceType).subscribe();
    this.openInNewTab(this.filesService.getFolderDownloadLink(downloadLink));
  }

  downloadFile({ resourceId, resourceType, downloadLink }: FileDownloadContext): void {
    if (!resourceId || !downloadLink) {
      return;
    }

    this.dataciteService.logFileDownload(resourceId, resourceType).subscribe();
    this.openInNewTab(downloadLink);
  }

  downloadFileOrFolder(params: { resourceId: string; resourceType: string; file: FileModel }): void {
    const { resourceId, resourceType, file } = params;

    if (!resourceId) {
      return;
    }

    this.dataciteService.logFileDownload(resourceId, resourceType).subscribe();

    if (file.kind === FileKind.File) {
      this.openInNewTab(file.links.download);
      return;
    }

    if (file.links.upload) {
      this.openInNewTab(this.filesService.getFolderDownloadLink(file.links.upload));
    }
  }

  private openInNewTab(url: string): void {
    if (!this.isBrowser || !url) {
      return;
    }

    window.open(url, '_blank')?.focus();
  }
}
