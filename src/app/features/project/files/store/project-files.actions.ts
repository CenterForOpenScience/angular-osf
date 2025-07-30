import { PatchFileMetadata } from '@osf/features/project/files/models';
import { OsfFile } from '@shared/models';

export class GetRootFolderFiles {
  static readonly type = '[Project Files] Get Root Folder Files';

  constructor(public projectId: string) {}
}

export class GetFiles {
  static readonly type = '[Project Files] Get Files';

  constructor(public filesLink: string) {}
}

export class SetFilesIsLoading {
  static readonly type = '[Project Files] Set Files Loading';

  constructor(public isLoading: boolean) {}
}

export class GetFile {
  static readonly type = '[Project Files] Get File';

  constructor(public fileGuid: string) {}
}

export class GetFileMetadata {
  static readonly type = '[Project Files] Get File Metadata';

  constructor(public fileGuid: string) {}
}

export class GetFileProjectMetadata {
  static readonly type = '[Project Files] Get File Project Metadata';

  constructor(public projectId: string) {}
}

export class GetMoveFileFiles {
  static readonly type = '[Project Files] Get Move File Files';

  constructor(public filesLink: string) {}
}

export class SetCurrentFolder {
  static readonly type = '[Project Files] Set Current Folder';

  constructor(public folder: OsfFile | null) {}
}

export class SetMoveFileCurrentFolder {
  static readonly type = '[Project Files] Set Move File Files';

  constructor(public folder: OsfFile | null) {}
}

export class CreateFolder {
  static readonly type = '[Project Files] Create folder';

  constructor(
    public newFolderLink: string,
    public folderName: string
  ) {}
}

export class DeleteEntry {
  static readonly type = '[Project Files] Delete entry';

  constructor(
    public projectId: string,
    public link: string
  ) {}
}
export class RenameEntry {
  static readonly type = '[Project Files] Rename entry';

  constructor(
    public projectId: string,
    public link: string,
    public name: string
  ) {}
}

export class SetSearch {
  static readonly type = '[Project Files] Set Search';

  constructor(public search: string) {}
}

export class SetSort {
  static readonly type = '[Project Files] Set Sort';

  constructor(public sort: string) {}
}

export class GetFileProjectContributors {
  static readonly type = '[Project Files] Get Projects Contributors';

  constructor(public projectId: string) {}
}

export class SetFileMetadata {
  static readonly type = '[Project Files] Set File Metadata';

  constructor(
    public payload: PatchFileMetadata,
    public fileGuid: string
  ) {}
}

export class GetFileRevisions {
  static readonly type = '[Project Files] Get Revisions';

  constructor(
    public projectId: string,
    public fileId: string
  ) {}
}

export class UpdateTags {
  static readonly type = '[Project Files] Update Tags';

  constructor(
    public tags: string[],
    public fileGuid: string
  ) {}
}

export class GetRootFolders {
  static readonly type = '[Project Files] Get Folders';

  constructor(public folderLink: string) {}
}

export class GetConfiguredStorageAddons {
  static readonly type = '[Project Files] Get ConfiguredStorageAddons';

  constructor(public resourceUri: string) {}
}

export class ResetState {
  static readonly type = '[Project Files] Reset State';
}
