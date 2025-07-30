import { JsonApiResponse } from '@core/models';
import { RegistryResourceDataJsonApi } from '@osf/features/registry/models/resources/add-resource-response-json-api.model';

export type GetRegistryResourcesJsonApi = JsonApiResponse<RegistryResourceDataJsonApi[], null>;
