import { OsfFileTarget } from '@osf/features/files/models';

import { BaseNodeModel } from '../nodes';

export interface BaseFileModel {
  id: string;
  guid: string | null;
  name: string;
  kind: string;
  path: string;
  size: number;
  materializedPath: string;
  dateModified: string;
  extra: FileExtraModel;
}

export interface FileModel extends BaseFileModel {
  links: FileLinksModel;
  parentFolderId: string | null;
  parentFolderLink: string | null;
  filesLink: string | null;
  target?: BaseNodeModel;
  previousFolder: boolean;
}

export interface FileDetailsModel extends BaseFileModel {
  provider: string;
  lastTouched: string | null;
  dateCreated: string;
  tags: string[];
  currentVersion: number;
  showAsUnviewed: boolean;
  links: FileLinksModel;
  target: BaseNodeModel;
}

export interface FileExtraModel {
  hashes: FileHashesModel;
  downloads: number;
}

interface FileHashesModel {
  md5: string;
  sha256: string;
}

export interface FileLinksModel {
  info: string;
  move: string;
  upload: string;
  delete: string;
  download: string;
  render: string;
  html: string;
  self: string;
}

export interface OsfFile {
  id: string;
  guid: string;
  name: string;
  kind: string;
  path: string;
  size: number;
  provider: string;
  materializedPath: string;
  lastTouched: null;
  dateModified: string;
  dateCreated: string;
  extra: {
    hashes: {
      md5: string;
      sha256: string;
    };
    downloads: number;
  };
  tags: [];
  currentUserCanComment: boolean;
  currentVersion: number;
  showAsUnviewed: boolean;
  links: {
    info: string;
    move: string;
    upload: string;
    delete: string;
    download: string;
    self: string;
    html: string;
    render: string;
    newFolder: string;
  };
  relationships: {
    parentFolderLink: string;
    parentFolderId: string;
    filesLink: string;
    uploadLink: string;
    newFolderLink: string;
  };
  target: OsfFileTarget;
  previousFolder: boolean;
}
