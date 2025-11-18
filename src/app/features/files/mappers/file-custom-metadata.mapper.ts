import { ApiData } from '@osf/shared/models/common/json-api.model';
import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

import { FileCustomMetadata, OsfFileCustomMetadata } from '../models';

export function MapFileCustomMetadata(data: ApiData<FileCustomMetadata, null, null, null>): OsfFileCustomMetadata {
  return {
    id: data.id,
    description: replaceBadEncodedChars(data.attributes.description),
    language: data.attributes.language,
    resourceTypeGeneral: data.attributes.resource_type_general,
    title: replaceBadEncodedChars(data.attributes.title),
  };
}
