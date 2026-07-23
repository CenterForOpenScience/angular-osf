import { Embed } from '@osf/shared/models/common/json-api/embeds.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';

export type ResourceCustomMetadataResponse = ItemResponse<ResourceCustomMetadataGuidDataJsonApi>;

export interface ResourceCustomMetadataGuidDataJsonApi extends JsonApiResource<'guids', Record<string, never>> {
  embeds: ResourceCustomMetadataEmbedsJsonApi;
}

interface ResourceCustomMetadataEmbedsJsonApi {
  custom_metadata: Embed<CustomMetadataDataJsonApi>;
}

type CustomMetadataDataJsonApi = JsonApiResource<'custom-metadata-records', CustomMetadataAttributesJsonApi>;

interface CustomMetadataAttributesJsonApi {
  funders: CustomMetadataFunderJsonApi[];
  language: string;
  resource_type_general: string;
}

interface CustomMetadataFunderJsonApi {
  award_number: string;
  award_title: string;
  award_uri: string;
  funder_identifier: string;
  funder_identifier_type: string;
  funder_name: string;
}
