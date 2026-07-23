import { FileKind } from '@osf/shared/enums/file-kind.enum';

import { Embed } from '../common/json-api/embeds.model';
import { RelatedCountRel, ToOneRel } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';

export type FileResponseJsonApi = ItemResponse<FileDataJsonApi>;
export type FilesResponseJsonApi = ListResponse<FileDataJsonApi>;
export type FileDetailsResponseJsonApi = ItemResponse<FileDetailsDataJsonApi>;

export interface FileDataJsonApi extends JsonApiResource<'files', BaseFileAttributesJsonApi> {
  relationships: FileRelationshipsJsonApi;
  links: FileLinksJsonApi;
  embeds?: FileEmbedsJsonApi;
}

export interface FileDetailsDataJsonApi extends JsonApiResource<'files', FileDetailsAttributesJsonApi> {
  relationships: FileRelationshipsJsonApi;
  links: FileLinksJsonApi;
  embeds?: FileEmbedsJsonApi;
}

export interface BaseFileAttributesJsonApi {
  date_modified: string;
  extra: FileExtraJsonApi;
  guid: string | null;
  kind: FileKind;
  materialized_path: string;
  name: string;
  path: string;
  provider: string;
  size: number;
}

export interface FileDetailsAttributesJsonApi extends BaseFileAttributesJsonApi {
  checkout: string | null;
  current_user_can_comment: boolean;
  current_version: number;
  date_created: string;
  last_touched: string | null;
  show_as_unviewed: boolean;
  tags: string[];
}

export interface FileExtraJsonApi {
  downloads: number;
  hashes: FileHashesJsonApi;
}

interface FileHashesJsonApi {
  md5: string;
  sha256: string;
}

interface FileRelationshipsJsonApi {
  files?: RelatedCountRel;
  parent_folder: ToOneRel<'files'>;
}

export interface FileLinksJsonApi {
  delete: string;
  download: string;
  html: string;
  info: string;
  move: string;
  render: string;
  self: string;
  upload: string;
}

interface FileEmbedsJsonApi {
  target: Embed<BaseNodeDataJsonApi>;
}
