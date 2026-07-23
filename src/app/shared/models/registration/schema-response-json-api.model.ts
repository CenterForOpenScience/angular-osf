import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

import { RelatedCountRel, ToOneRel } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';

export type SchemaResponsesJsonApi = ListResponse<SchemaResponseDataJsonApi>;
export type SchemaResponseJsonApi = ItemResponse<SchemaResponseDataJsonApi>;

export interface SchemaResponseDataJsonApi extends JsonApiResource<
  'schema_responses',
  SchemaResponseAttributesJsonApi
> {
  relationships: SchemaResponseRelationshipsJsonApi;
  embeds?: SchemaResponseEmbedsJsonApi;
}

interface SchemaResponseAttributesJsonApi {
  date_created: string;
  date_modified: string;
  date_submitted: string | null;
  id: string;
  is_original_response: boolean;
  is_pending_current_user_approval: boolean;
  revision_justification: string;
  revision_responses: Record<string, unknown>;
  reviews_state: RevisionReviewStates;
  updated_response_keys: string[];
}

interface SchemaResponseRelationshipsJsonApi {
  registration: ToOneRel<'registrations'>;
  registration_schema?: ToOneRel<'registration-schemas'>;
}

interface SchemaResponseEmbedsJsonApi {
  registration: SchemaResponseRegistrationEmbedJsonApi;
}

interface SchemaResponseRegistrationEmbedJsonApi {
  data: {
    relationships: {
      files: RelatedCountRel;
    };
  };
}
