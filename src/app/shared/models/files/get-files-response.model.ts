import { FileTargetResponse } from '@osf/features/files/models';
import { ApiData, JsonApiResponse } from '@shared/models';

export type GetFilesResponse = JsonApiResponse<FileData[], null>;
export type GetFileResponse = JsonApiResponse<FileData, null>;
export type FileData = ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>;
export type AddFileResponse = ApiData<FileResponse, null, null, null>;

export interface FileResponse {
  guid: string;
  name: string;
  kind: string;
  path: string;
  size: number;
  provider: string;
  materialized_path: string;
  last_touched: null;
  date_modified: string;
  date_created: string;
  extra: {
    hashes: {
      md5: string;
      sha256: string;
    };
    downloads: number;
  };
  tags: [];
  current_user_can_comment: boolean;
  current_version: number;
  show_as_unviewed: boolean;
}

export interface FileRelationshipsResponse {
  parent_folder: {
    links: {
      related: {
        href: string;
      };
    };
    data: {
      id: string;
      type: string;
    };
  };
  files: {
    links: {
      related: {
        href: string;
      };
    };
  };
  root_folder: {
    links: {
      related: {
        href: string;
      };
    };
    data: {
      id: string;
      type: string;
    };
  };
}

export interface FileLinks {
  info: string;
  move: string;
  upload: string;
  delete: string;
  download: string;
  self: string;
  html: string;
  render: string;
  new_folder: string;
}
