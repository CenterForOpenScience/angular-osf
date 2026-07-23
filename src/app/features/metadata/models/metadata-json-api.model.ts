import { ToOneRel } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { UserPermissions } from '@shared/enums/user-permissions.enum';
import { Embed } from '@shared/models/common/json-api/embeds.model';
import { ItemResponse } from '@shared/models/common/json-api/responses.model';
import { IdentifiersResponseJsonApi } from '@shared/models/identifiers/identifier-json-api.model';
import { LicenseDataJsonApi, LicenseRecordJsonApi } from '@shared/models/license/licenses-json-api.model';

export type MetadataResponseJsonApi = ItemResponse<MetadataDataJsonApi>;
export type CustomMetadataResponseJsonApi = ItemResponse<CustomMetadataDataJsonApi>;

export interface MetadataDataJsonApi extends JsonApiResource<'metadata', MetadataAttributesJsonApi> {
  relationships: MetadataRelationshipsJsonApi;
  embeds?: MetadataEmbedsJsonApi;
}

export type CustomMetadataDataJsonApi = JsonApiResource<
  'custom-item-metadata-records',
  CustomMetadataAttributesJsonApi
>;

export interface MetadataAttributesJsonApi {
  article_doi?: string;
  category?: string;
  current_user_permissions: UserPermissions[];
  date_created: string;
  date_modified: string;
  description: string;
  doi?: boolean;
  node_license?: LicenseRecordJsonApi;
  public?: boolean;
  registration_supplement?: string;
  tags: string[];
  title: string;
}

interface CustomMetadataAttributesJsonApi {
  funders?: FunderJsonApi[];
  language?: string;
  resource_type_general?: string;
}

interface FunderJsonApi {
  award_number: string;
  award_title: string;
  award_uri: string;
  funder_identifier: string;
  funder_identifier_type: string;
  funder_name: string;
}

interface MetadataEmbedsJsonApi {
  identifiers: IdentifiersResponseJsonApi;
  license: Embed<LicenseDataJsonApi>;
}

interface MetadataRelationshipsJsonApi {
  provider: ToOneRel;
}
