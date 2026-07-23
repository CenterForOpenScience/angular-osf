import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

import { OsfFileCustomMetadata } from '../models/file-custom-metadata.model';
import { FileCustomMetadataDataJsonApi } from '../models/file-metadata-response.model';

export function MapFileCustomMetadata(data: FileCustomMetadataDataJsonApi): OsfFileCustomMetadata {
  return {
    id: data.id,
    description: replaceBadEncodedChars(data.attributes.description),
    language: data.attributes.language,
    resourceTypeGeneral: data.attributes.resource_type_general,
    title: replaceBadEncodedChars(data.attributes.title),
  };
}
