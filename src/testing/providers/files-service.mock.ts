import { Observable, of } from 'rxjs';

import { Mock, vi } from 'vitest';

import { HttpEvent } from '@angular/common/http';

import { MetaJsonApi } from '@osf/shared/models/common/json-api.model';
import { FileDetailsModel, FileDetailsWithMeta, FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileVersionModel } from '@osf/shared/models/files/file-version.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { FilesService } from '@osf/shared/services/files.service';

import { FileModelMock } from '@testing/mocks/file.model.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';

type GetFilesFn = (
  filesLink: string,
  search: string,
  sort: string,
  page?: number
) => Observable<{ files: FileModel[]; meta?: MetaJsonApi }>;
type GetFoldersFn = (folderLink: string) => Observable<{ files: FileFolderModel[]; meta?: MetaJsonApi }>;
type GetRootFoldersFn = (
  resourceId: string,
  resourceType: number
) => Observable<{ files: FileFolderModel[]; meta?: MetaJsonApi }>;
type GetFilesWithoutFilteringFn = (filesLink: string, page?: number) => Observable<PaginatedData<FileModel[]>>;
type UploadFileFn = (file: File, uploadLink: string, isUpdate?: boolean) => Observable<HttpEvent<any>>;
type GetFolderFn = (link: string) => Observable<FileFolderModel>;
type DeleteEntryFn = (link: string) => Observable<unknown>;
type RenameEntryFn = (link: string, name: string, conflict?: string) => Observable<FileModel>;
type MoveFileFn = (
  link: string,
  path: string,
  resourceId: string,
  provider: string,
  action: string,
  replace?: boolean
) => Observable<unknown>;
type GetFolderDownloadLinkFn = (link: string) => string;
type GetFileTargetFn = (fileGuid: string) => Observable<FileDetailsWithMeta>;
type GetFileGuidFn = (id: string) => Observable<FileModel>;
type GetFileByIdFn = (fileGuid: string) => Observable<FileModel>;
type GetFileVersionsFn = (fileGuid: string) => Observable<FileVersionModel[]>;

export type FilesServiceMockType = Pick<
  FilesService,
  | 'getFiles'
  | 'getFolders'
  | 'getRootFolders'
  | 'getFilesWithoutFiltering'
  | 'uploadFile'
  | 'getFolder'
  | 'deleteEntry'
  | 'renameEntry'
  | 'moveFile'
  | 'getFolderDownloadLink'
  | 'getFileTarget'
  | 'getFileGuid'
  | 'getFileById'
  | 'getFileVersions'
> & {
  getFiles: Mock<GetFilesFn>;
  getFolders: Mock<GetFoldersFn>;
  getRootFolders: Mock<GetRootFoldersFn>;
  getFilesWithoutFiltering: Mock<GetFilesWithoutFilteringFn>;
  uploadFile: Mock<UploadFileFn>;
  getFolder: Mock<GetFolderFn>;
  deleteEntry: Mock<DeleteEntryFn>;
  renameEntry: Mock<RenameEntryFn>;
  moveFile: Mock<MoveFileFn>;
  getFolderDownloadLink: Mock<GetFolderDownloadLinkFn>;
  getFileTarget: Mock<GetFileTargetFn>;
  getFileGuid: Mock<GetFileGuidFn>;
  getFileById: Mock<GetFileByIdFn>;
  getFileVersions: Mock<GetFileVersionsFn>;
};

export const FilesServiceMock = {
  simple(): FilesServiceMockType {
    const file = FileModelMock.simple();
    const folder = { ...OSF_FILE_MOCK };
    const fileDetails: FileDetailsModel = {
      id: file.id,
      guid: file.guid,
      name: file.name,
      kind: file.kind,
      path: file.path,
      size: file.size,
      materializedPath: file.materializedPath,
      dateModified: file.dateModified,
      extra: file.extra,
      lastTouched: null,
      dateCreated: '',
      tags: [],
      currentVersion: 1,
      showAsUnviewed: false,
      links: file.links,
      target: null,
    };

    return {
      getFiles: vi.fn().mockReturnValue(of({ files: [file], meta: { total: 1, per_page: 10 } as MetaJsonApi })),
      getFolders: vi.fn().mockReturnValue(of({ files: [folder], meta: { total: 1, per_page: 10 } as MetaJsonApi })),
      getRootFolders: vi.fn().mockReturnValue(of({ files: [folder], meta: { total: 1, per_page: 10 } as MetaJsonApi })),
      getFilesWithoutFiltering: vi
        .fn()
        .mockReturnValue(of({ data: [file], totalCount: 1, pageSize: 10 } as PaginatedData<FileModel[]>)),
      uploadFile: vi.fn().mockReturnValue(of({} as HttpEvent<any>)),
      getFolder: vi.fn().mockReturnValue(of(folder)),
      deleteEntry: vi.fn().mockReturnValue(of(void 0)),
      renameEntry: vi.fn().mockReturnValue(of(file)),
      moveFile: vi.fn().mockReturnValue(of({})),
      getFolderDownloadLink: vi.fn().mockImplementation((link: string) => `${link}?zip=`),
      getFileTarget: vi.fn().mockReturnValue(of({ file: fileDetails })),
      getFileGuid: vi.fn().mockReturnValue(of(file)),
      getFileById: vi.fn().mockReturnValue(of(file)),
      getFileVersions: vi.fn().mockReturnValue(of([])),
    } as FilesServiceMockType;
  },
};
