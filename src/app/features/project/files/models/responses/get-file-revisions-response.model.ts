import { ApiData, JsonApiResponse } from '@osf/shared/models';

export interface FileRevisionJsonApi {
  extra: {
    downloads: 0;
    hashes: {
      md5: string;
      sha256: string;
    };
  };
  version: string;
  modified: string;
  modified_utc: string;
}

export type GetFileRevisionsResponse = JsonApiResponse<ApiData<FileRevisionJsonApi, null, null, null>[], null>;
