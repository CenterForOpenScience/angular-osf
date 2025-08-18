import { PatchFileMetadata } from '../models';

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

  constructor(
    public resourceId: string,
    public resourceType: string,
    public fileId: string
  ) {}
}

export class UpdateTags {
  static readonly type = '[Files] Update Tags';

  constructor(
    public tags: string[],
    public fileGuid: string
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

export class ResetState {
  static readonly type = '[Files] Reset State';
}
