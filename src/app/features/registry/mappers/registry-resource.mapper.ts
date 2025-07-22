import { RegistryResourceDataJsonApi } from '@osf/features/registry/models/resources/get-registry-resources-json-api.model';
import { RegistryResource } from '@osf/features/registry/models/resources/registry-resource.model';

export function MapRegistryResource(resource: RegistryResourceDataJsonApi): RegistryResource {
  return {
    id: resource.id,
    description: resource.attributes.description,
    finalized: resource.attributes.finalized,
    type: resource.attributes.resource_type,
    pid: resource.attributes.pid,
  };
}
