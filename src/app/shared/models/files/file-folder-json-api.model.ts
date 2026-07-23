import { FileKind } from '@osf/shared/enums/file-kind.enum';

import { ToManyRel, ToOneRel } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';

export type FileFolderResponseJsonApi = ItemResponse<FileFolderDataJsonApi>;
export type FileFoldersResponseJsonApi = ListResponse<FileFolderDataJsonApi>;

export interface FileFolderDataJsonApi extends JsonApiResource<'files', FileFolderAttributesJsonApi> {
  relationships: FileFolderRelationshipsJsonApi;
  links: FileFolderLinksJsonApi;
}

export interface FileFolderAttributesJsonApi {
  kind: FileKind.Folder;
  name: string;
  node: string;
  path: string;
  provider: string;
}

interface FileFolderRelationshipsJsonApi {
  files: ToManyRel<'files'>;
  root_folder: ToOneRel<'files'>;
  target: ToOneRel<'nodes'>;
}

interface FileFolderLinksJsonApi {
  download?: string;
  new_folder: string;
  storage_addons: string;
  upload: string;
}
