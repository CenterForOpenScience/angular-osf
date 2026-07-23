import { Mock, vi } from 'vitest';

import { FileModel } from '@osf/shared/models/files/file.model';
import { FileDownloadContext } from '@osf/shared/models/files/file-download-context.model';
import { FileDownloadService } from '@osf/shared/services/file-download.service';

type DownloadFolderAsZipFn = (context: FileDownloadContext) => void;
type DownloadFileFn = (context: FileDownloadContext) => void;
type DownloadFileOrFolderFn = (params: { resourceId: string; resourceType: string; file: FileModel }) => void;

export type FileDownloadServiceMockType = Pick<
  FileDownloadService,
  'downloadFolderAsZip' | 'downloadFile' | 'downloadFileOrFolder'
> & {
  downloadFolderAsZip: Mock<DownloadFolderAsZipFn>;
  downloadFile: Mock<DownloadFileFn>;
  downloadFileOrFolder: Mock<DownloadFileOrFolderFn>;
};

export class FileDownloadServiceMockBuilder {
  private downloadFolderAsZipMock: Mock<DownloadFolderAsZipFn> = vi.fn();
  private downloadFileMock: Mock<DownloadFileFn> = vi.fn();
  private downloadFileOrFolderMock: Mock<DownloadFileOrFolderFn> = vi.fn();

  static create(): FileDownloadServiceMockBuilder {
    return new FileDownloadServiceMockBuilder();
  }

  withDownloadFolderAsZip(mockImpl: Mock<DownloadFolderAsZipFn>): FileDownloadServiceMockBuilder {
    this.downloadFolderAsZipMock = mockImpl;
    return this;
  }

  withDownloadFile(mockImpl: Mock<DownloadFileFn>): FileDownloadServiceMockBuilder {
    this.downloadFileMock = mockImpl;
    return this;
  }

  withDownloadFileOrFolder(mockImpl: Mock<DownloadFileOrFolderFn>): FileDownloadServiceMockBuilder {
    this.downloadFileOrFolderMock = mockImpl;
    return this;
  }

  build(): FileDownloadServiceMockType {
    return {
      downloadFolderAsZip: this.downloadFolderAsZipMock,
      downloadFile: this.downloadFileMock,
      downloadFileOrFolder: this.downloadFileOrFolderMock,
    } as FileDownloadServiceMockType;
  }
}

export const FileDownloadServiceMock = {
  create() {
    return FileDownloadServiceMockBuilder.create();
  },
  simple() {
    return FileDownloadServiceMockBuilder.create().build();
  },
};
