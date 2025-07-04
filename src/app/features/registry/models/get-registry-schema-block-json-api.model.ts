import { ApiData, JsonApiResponse } from '@core/models';

export type GetRegistrySchemaBlockJsonApi = JsonApiResponse<ApiData<SchemaBlockAttributes, null, null, null>[], null>;

export interface SchemaBlockAttributes {
  block_type: string;
  display_text: string;
  registration_response_key: string | null;
  required: boolean;
  schema_block_group_key: string;
}
