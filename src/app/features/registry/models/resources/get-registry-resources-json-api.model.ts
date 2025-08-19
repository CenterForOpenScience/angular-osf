import { RegistryResourceDataJsonApi } from '@osf/features/registry/models/resources/add-resource-response-json-api.model';
import { JsonApiResponse } from '@shared/models';

export type GetRegistryResourcesJsonApi = JsonApiResponse<RegistryResourceDataJsonApi[], null>;
