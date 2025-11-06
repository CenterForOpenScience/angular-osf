import { RegistryResource, RegistryResourceDataJsonApi } from '../models';

export function MapRegistryResource(resource: RegistryResourceDataJsonApi): RegistryResource {
  return {
    id: resource.id,
    description: resource.attributes.description,
    finalized: resource.attributes.finalized,
    type: resource.attributes.resource_type,
    pid: resource.attributes.pid,
  };
}
