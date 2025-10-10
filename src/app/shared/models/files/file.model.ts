import { BaseNodeModel } from '../nodes';

import { FileKind } from './../../enums/file-kind.enum';

export interface BaseFileModel {
  id: string;
  guid: string | null;
  name: string;
  kind: FileKind;
  path: string;
  size: number;
  materializedPath: string;
  dateModified: string;
  extra: FileExtraModel;
}

export interface FileModel extends BaseFileModel {
  links: FileLinksModel;
  filesLink: string | null;
  target?: BaseNodeModel;
  previousFolder: boolean;
  provider: string;
}

export interface FileDetailsModel extends BaseFileModel {
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
