import { ApiData } from '@osf/core/models';
import { OsfFileCustomMetadata } from '@osf/features/project/files/models/osf-models/file-custom-metafata.model';
import { FileCustomMetadata } from '@osf/features/project/files/models/responses/get-file-metadata-reponse.model';

export function MapFileCustomMetadata(data: ApiData<FileCustomMetadata, null, null, null>): OsfFileCustomMetadata {
  return {
    id: data.id,
    description: data.attributes.description,
    language: data.attributes.language,
    resourceTypeGeneral: data.attributes.resource_type_general,
    title: data.attributes.title,
  };
}
