import { FileKind } from '@osf/shared/enums/file-kind.enum';

import { ResponseJsonApi } from '../common/json-api.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';

export type FileResponseJsonApi = ResponseJsonApi<FileDataJsonApi>;
export type FilesResponseJsonApi = ResponseJsonApi<FileDataJsonApi[]>;
export type FileDetailsResponseJsonApi = ResponseJsonApi<FileDetailsDataJsonApi>;

export interface FileDataJsonApi {
  id: string;
  type: 'files';
  attributes: BaseFileAttributesJsonApi;
  relationships: FileRelationshipsJsonApi;
  links: FileLinksJsonApi;
  embeds?: FileEmbedsJsonApi;
}

export interface FileDetailsDataJsonApi {
  id: string;
  type: 'files';
  attributes: FileDetailsAttributesJsonApi;
  relationships: FileRelationshipsJsonApi;
  links: FileLinksJsonApi;
  embeds?: FileEmbedsJsonApi;
}

export interface BaseFileAttributesJsonApi {
  guid: string | null;
  name: string;
  kind: FileKind;
  path: string;
  size: number;
  materialized_path: string;
  date_modified: string;
  extra: FileExtraJsonApi;
  provider: string;
}

export interface FileDetailsAttributesJsonApi extends BaseFileAttributesJsonApi {
  checkout: string | null;
  last_touched: string | null;
  date_created: string;
  tags: string[];
  current_user_can_comment: boolean;
  current_version: number;
  show_as_unviewed: boolean;
}

export interface FileExtraJsonApi {
  hashes: FileHashesJsonApi;
  downloads: number;
}

interface FileHashesJsonApi {
  md5: string;
  sha256: string;
}

interface FileRelationshipsJsonApi {
  parent_folder: ParentFolderJsonApi;
  files?: FilesRelationshipsJsonApi;
}

interface ParentFolderJsonApi {
  links: {
    related: RelatedLinkJsonApi;
  };
  data: {
    id: string;
    type: 'files';
  };
}

interface FilesRelationshipsJsonApi {
  links: {
    related: RelatedLinkJsonApi;
  };
}

interface RelatedLinkJsonApi {
  href: string;
  meta: Record<string, unknown>;
}

export interface FileLinksJsonApi {
  info: string;
  move: string;
  upload: string;
  delete: string;
  download: string;
  render: string;
  html: string;
  self: string;
}

interface FileEmbedsJsonApi {
  target: {
    data: BaseNodeDataJsonApi;
  };
}
