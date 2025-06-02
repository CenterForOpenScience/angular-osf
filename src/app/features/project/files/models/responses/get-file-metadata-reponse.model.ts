import { ApiData, JsonApiResponse } from '@core/models';

export type GetFileMetadataResponse = JsonApiResponse<ApiData<FileCustomMetadata, null, null, null>, null>;

export interface FileCustomMetadata {
  language: string;
  resource_type_general: string;
  title: string;
  description: string;
}
