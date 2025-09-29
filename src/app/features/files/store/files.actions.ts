import { OsfFile } from '@osf/shared/models';

import { PatchFileMetadata } from '../models';

export class GetRootFolderFiles {
  static readonly type = '[Files] Get Root Folder Files';

  constructor(public resourceId: string) {}
}

export class GetFiles {
  static readonly type = '[Files] Get Files';

  constructor(
    public filesLink: string,
    public page?: number
  ) {}
}

export class SetFilesIsLoading {
  static readonly type = '[Files] Set Files Loading';

  constructor(public isLoading: boolean) {}
}

export class RenameEntry {
  static readonly type = '[Files] Rename entry';

  constructor(
    public resourceId: string,
    public link: string,
    public name: string
  ) {}
}

export class SetSearch {
  static readonly type = '[Files] Set Search';

  constructor(public search: string) {}
}

export class SetSort {
  static readonly type = '[Files] Set Sort';

  constructor(public sort: string) {}
}

export class SetCurrentFolder {
  static readonly type = '[Files] Set Current Folder';

  constructor(public folder: OsfFile | null) {}
}

export class SetMoveFileCurrentFolder {
  static readonly type = '[Files] Set Move File Current Folder';

  constructor(public folder: OsfFile | null) {}
}

export class GetMoveFileFiles {
  static readonly type = '[Files] Get Move File Files';

  constructor(
    public filesLink: string,
    public page?: number
  ) {}
}

export class SetCurrentProvider {
  static readonly type = '[Files] Set Current Provider';

  constructor(public provider: string) {}
}

export class GetFile {
  static readonly type = '[Files] Get File';

  constructor(public fileGuid: string) {}
}

export class GetFileMetadata {
  static readonly type = '[Files] Get File Metadata';

  constructor(public fileGuid: string) {}
}

export class GetFileResourceMetadata {
  static readonly type = '[Files] Get File Resource Metadata';

  constructor(
    public resourceId: string,
    public resourceType: string
  ) {}
}

export class GetFileResourceContributors {
  static readonly type = '[Files] Get File Resource Contributors';

  constructor(
    public resourceId: string,
    public resourceType: string
  ) {}
}

export class SetFileMetadata {
  static readonly type = '[Files] Set File Metadata';

  constructor(
    public payload: PatchFileMetadata,
    public fileGuid: string
  ) {}
}

export class GetFileRevisions {
  static readonly type = '[Files] Get Revisions';

  constructor(public link: string) {}
}

export class UpdateTags {
  static readonly type = '[Files] Update Tags';

  constructor(
    public tags: string[],
    public fileGuid: string
  ) {}
}

export class CreateFolder {
  static readonly type = '[Files] Create folder';

  constructor(
    public newFolderLink: string,
    public folderName: string
  ) {}
}

export class DeleteEntry {
  static readonly type = '[Files] Delete entry';

  constructor(
    public resourceId: string,
    public link: string
  ) {}
}

export class GetRootFolders {
  static readonly type = '[Files] Get Folders';

  constructor(public folderLink: string) {}
}

export class GetConfiguredStorageAddons {
  static readonly type = '[Files] Get ConfiguredStorageAddons';

  constructor(public resourceUri: string) {}
}

export class GetStorageSupportedFeatures {
  static readonly type = '[Files] Get Storage Supported Features';

  constructor(
    public storageId: string,
    public providerName: string
  ) {}
}

export class ResetState {
  static readonly type = '[Files] Reset State';
}
