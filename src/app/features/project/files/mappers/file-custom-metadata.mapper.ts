import { FileCustomMetadata, OsfFileCustomMetadata } from '@osf/features/project/files/models';
import { ApiData } from '@osf/shared/models';

export function MapFileCustomMetadata(data: ApiData<FileCustomMetadata, null, null, null>): OsfFileCustomMetadata {
  return {
    id: data.id,
    description: data.attributes.description,
    language: data.attributes.language,
    resourceTypeGeneral: data.attributes.resource_type_general,
    title: data.attributes.title,
  };
}
