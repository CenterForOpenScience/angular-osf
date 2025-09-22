import { AddResourceRequest } from '../models';

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

export function toAddResourceRequestBody(registryId: string) {
  return {
    data: {
      relationships: {
        registration: {
          data: {
            type: 'registrations',
            id: registryId,
          },
        },
      },
      type: 'resources',
    },
  };
}
