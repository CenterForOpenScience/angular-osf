import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';

export type FileMetadataResponse = ItemResponse<FileCustomMetadataDataJsonApi>;

export type FileCustomMetadataDataJsonApi = JsonApiResource<
  'custom_file_metadata_records',
  FileCustomMetadataAttributesJsonApi
>;

interface FileCustomMetadataAttributesJsonApi {
  description: string;
  language: string;
  resource_type_general: string;
  title: string;
}
