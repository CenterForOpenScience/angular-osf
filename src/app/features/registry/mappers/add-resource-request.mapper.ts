import { AddResourceRequest } from '@osf/features/registry/models/resources/add-resource-request.model';

export interface AddResourcePayload<T> {
  data: AddResourceRequest<T>;
}

export function MapAddResourceRequest<T>(
  resourceId: string,
  resource: T,
  type = 'resources',
  relationships: object = {}
): AddResourcePayload<T> {
  const resourceData: AddResourceRequest<T> = {
    attributes: resource,
    id: resourceId,
    relationships,
    type,
  };

  return {
    data: resourceData,
  };
}
