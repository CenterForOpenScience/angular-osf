import { EmbedList } from '@osf/shared/models/common/json-api/embeds.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { ContributorDataJsonApi } from '@osf/shared/models/contributors/contributor-response-json-api.model';
import { RegistrationNodeAttributesJsonApi } from '@osf/shared/models/registration/registration-node-json-api.model';

export type RegistryComponentsJsonApiResponse = ListResponse<RegistryComponentJsonApi>;

export interface RegistryComponentJsonApi extends JsonApiResource<'registrations', RegistrationNodeAttributesJsonApi> {
  embeds: RegistryComponentEmbedsJsonApi;
}

interface RegistryComponentEmbedsJsonApi {
  bibliographic_contributors: EmbedList<ContributorDataJsonApi>;
}
