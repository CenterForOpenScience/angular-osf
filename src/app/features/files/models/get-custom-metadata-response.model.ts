import { ApiData, JsonApiResponse } from '@osf/shared/models/common/json-api.model';

export type GetCustomMetadataResponse = JsonApiResponse<ApiData<null, MetadataEmbedResponse, null, null>, null>;

export interface MetadataEmbedResponse {
  custom_metadata: JsonApiResponse<
    ApiData<
      {
        language: string;
        resource_type_general: string;
        funders: {
          funder_name: string;
          funder_identifier: string;
          funder_identifier_type: string;
          award_number: string;
          award_uri: string;
          award_title: string;
        }[];
      },
      null,
      null,
      null
    >,
    null
  >;
}
