import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

import { EmbedList } from '../common/json-api/embeds.model';
import { RelatedCountRel, ToOneRel, ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource, JsonApiResourceRef } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';
import { ContributorDataJsonApi } from '../contributors/contributor-response-json-api.model';
import { LicenseRecordJsonApi } from '../license/licenses-json-api.model';
import { RegistryProviderDetailsJsonApi } from '../provider/registration-provider-json-api.model';

import { RegistrationNodeAttributesJsonApi } from './registration-node-json-api.model';

export type DraftRegistrationResponseJsonApi = ItemResponse<DraftRegistrationDataJsonApi>;
export type DraftRegistrationListResponseJsonApi = ListResponse<DraftRegistrationDataJsonApi>;
export type RegistrationResponseJsonApi = ItemResponse<RegistrationDataJsonApi>;
export type RegistrationListResponseJsonApi = ListResponse<RegistrationDataJsonApi>;

export interface DraftRegistrationDataJsonApi extends JsonApiResource<
  'draft_registrations',
  DraftRegistrationAttributesJsonApi
> {
  relationships: DraftRegistrationRelationshipsJsonApi;
  embeds?: DraftRegistrationEmbedsJsonApi;
}

export interface RegistrationDataJsonApi extends JsonApiResource<'registrations', RegistrationNodeAttributesJsonApi> {
  relationships: RegistrationRelationshipsJsonApi;
  embeds?: RegistrationEmbedsJsonApi;
}

export interface CreateRegistrationPayloadJsonApi {
  data: {
    id: string;
    type: 'draft_registrations';
    relationships?: DraftRegistrationRelationshipPayloadJsonApi;
    attributes?: Partial<DraftRegistrationAttributesJsonApi>;
  };
}

export interface DraftRegistrationRelationshipPayloadJsonApi {
  branched_from?: { data: JsonApiResourceRef<'nodes'> | null };
  license?: { data: JsonApiResourceRef<'licenses'> | null };
  provider?: { data: JsonApiResourceRef<'providers'> | null };
  registration_schema?: { data: JsonApiResourceRef<'registration-schemas'> | null };
}

export interface DraftRegistrationAttributesJsonApi {
  category: string;
  current_user_permissions: UserPermissions[];
  date_created: string;
  datetime_initiated: string;
  datetime_updated: string;
  default_license_id?: string;
  description: string;
  has_project: boolean;
  node_license: LicenseRecordJsonApi;
  public?: boolean;
  registration_metadata: Record<string, unknown>;
  registration_responses: Record<string, unknown>;
  tags: string[];
  title: string;
}

export interface DraftRegistrationRelationshipsJsonApi {
  branched_from?: ToOneRel<'nodes'>;
  license?: ToOneRel<'licenses'>;
  provider?: ToOneRel<'providers'>;
  registration_schema?: ToOneRel<'registration-schemas'>;
}

export interface RegistrationAttributesJsonApi {
  access_requests_enabled: boolean;
  archiving: boolean;
  current_user_permissions: UserPermissions[];
  date_created: string;
  date_modified: string;
  description: string;
  embargoed: boolean;
  has_analytic_code: boolean;
  has_data: boolean;
  has_materials: boolean;
  has_papers: boolean;
  has_project: boolean;
  has_supplements: boolean;
  pending_embargo_approval: boolean;
  pending_embargo_termination_approval: boolean;
  pending_registration_approval: boolean;
  public: boolean;
  revision_state: RevisionReviewStates;
  reviews_state: RegistrationReviewStates;
  title: string;
}

interface RegistrationRelationshipsJsonApi {
  license?: ToOneRel<'licenses'>;
  registration_schema?: ToOneRel<'registration-schemas'>;
  root: ToOneRelData;
}

interface RegistrationEmbedsJsonApi {
  bibliographic_contributors?: EmbedList<ContributorDataJsonApi>;
  provider?: RegistrationProviderEmbedJsonApi;
  registration_schema?: RegistrationSchemaNameEmbedJsonApi;
}

interface DraftRegistrationEmbedsJsonApi extends RegistrationEmbedsJsonApi {
  branched_from?: BranchedFromEmbedJsonApi;
}

interface RegistrationSchemaNameEmbedJsonApi {
  data: {
    attributes: {
      name: string;
    };
  };
}

interface RegistrationProviderEmbedJsonApi {
  data: RegistryProviderDetailsJsonApi;
}

interface BranchedFromEmbedJsonApi {
  data: {
    id: string;
    type: string;
    attributes: {
      title: string;
    };
    relationships?: {
      files?: RelatedCountRel;
    };
  };
}
