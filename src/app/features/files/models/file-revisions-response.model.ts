import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { DataResponse } from '@osf/shared/models/common/json-api/responses.model';

export type FileRevisionsResponse = DataResponse<FileRevisionDataJsonApi[]>;

export type FileRevisionDataJsonApi = JsonApiResource<string, FileRevisionAttributesJsonApi>;

interface FileRevisionAttributesJsonApi {
  extra: FileRevisionExtraJsonApi;
  modified: string;
  modified_utc: string;
  version: string;
}

interface FileRevisionExtraJsonApi {
  downloads: number;
  hashes: FileRevisionHashesJsonApi;
}

interface FileRevisionHashesJsonApi {
  md5: string;
  sha256: string;
}
