import { FileKind } from '@osf/shared/enums';

import { ResponseJsonApi } from '../common';

export type FileFolderResponseJsonApi = ResponseJsonApi<FileFolderDataJsonApi>;
export type FileFoldersResponseJsonApi = ResponseJsonApi<FileFolderDataJsonApi[]>;

export interface FileFolderDataJsonApi {
  id: string;
  type: 'files';
  attributes: FileFolderAttributesJsonApi;
  relationships: FileFolderRelationshipsJsonApi;
  links: FileFolderLinksJsonApi;
}

export interface FileFolderAttributesJsonApi {
  kind: FileKind.Folder;
  name: string;
  path: string;
  node: string;
  provider: string;
}

interface FileFolderRelationshipsJsonApi {
  files: RelationshipLinksOnlyJsonApi;
  root_folder: RelationshipWithDataJsonApi<'files'>;
  target: RelationshipWithDataJsonApi<'nodes'>;
}

interface RelationshipLinksOnlyJsonApi {
  links: {
    related: RelatedLinkJsonApi;
  };
}

interface RelationshipWithDataJsonApi<T extends string> {
  links: {
    related: RelatedLinkJsonApi;
  };
  data: {
    id: string;
    type: T;
  };
}

interface RelatedLinkJsonApi {
  href: string;
  meta: Record<string, unknown>;
}

interface FileFolderLinksJsonApi {
  upload: string;
  new_folder: string;
  storage_addons: string;
  download?: string;
}
