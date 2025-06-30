import { ApiData, JsonApiResponse } from '@core/models';

export type GetRegistrySchemaBlockJsonApi = JsonApiResponse<ApiData<SchemaBlockAttributes, null, null, null>[], null>;

export interface SchemaBlockAttributes {
  // block_type:
  //   | 'page-heading'
  //   | 'subsection-heading'
  //   | 'paragraph'
  //   | 'question-label'
  //   | 'long-text-input'
  //   | 'file-input'
  //   | 'single-select-input'
  //   | 'multi-select-input';
  block_type: string;
  display_text: string;
  registration_response_key: string | null;
  required: boolean;
}
