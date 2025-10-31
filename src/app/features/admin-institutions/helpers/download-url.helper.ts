import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';

import { DOWNLOAD_FORMATS } from '../constants';
import { DownloadType } from '../enums';

interface ResourceNameText {
  singular_upper: string;
  plural_lower: string;
}

export const INSTITUTIONS_CSV_TSV_FIELDS = {
  [CurrentResourceType.Preprints]: [
    'title',
    'dateCreated',
    'dateModified',
    'sameAs',
    'rights.name',
    'creator.@id',
    'creator.name',
    'usage.viewCount',
    'usage.downloadCount',
  ],
  [CurrentResourceType.Projects]: [
    'title',
    'dateCreated',
    'dateModified',
    'sameAs',
    'storageRegion.prefLabel',
    'storageByteCount',
    'creator.@id',
    'creator.name',
    'usage.viewCount',
    'resourceNature.displayLabel',
    'rights.name',
    'hasOsfAddon.prefLabel',
    'funder.name',
  ],
  [CurrentResourceType.Registrations]: [
    'title',
    'dateCreated',
    'dateModified',
    'sameAs',
    'storageRegion.prefLabel',
    'storageByteCount',
    'creator.@id',
    'creator.name',
    'usage.viewCount',
    'resourceNature.displayLabel',
    'rights.name',
    'funder.name',
    'conformsTo.title',
  ],
};

export const INSTITUTIONS_DOWNLOAD_CSV_TSV_RESOURCE = {
  [CurrentResourceType.Projects]: {
    singular_upper: 'Project',
    plural_lower: 'projects',
  },
  [CurrentResourceType.Registrations]: {
    singular_upper: 'Registration',
    plural_lower: 'registrations',
  },
  [CurrentResourceType.Preprints]: {
    singular_upper: 'Preprint',
    plural_lower: 'preprints',
  },
};

export function downloadResults(
  downloadUrl: string | null,
  type: DownloadType,
  fields: string[],
  resourceNameText: ResourceNameText
) {
  if (!downloadUrl) {
    return;
  }

  const cardSearchUrl = new URL(downloadUrl as string);
  const format = DOWNLOAD_FORMATS[type];

  cardSearchUrl.searchParams.set('page[size]', '10000');
  cardSearchUrl.searchParams.set('page[cursor]', '');
  cardSearchUrl.searchParams.set('acceptMediatype', format);
  cardSearchUrl.searchParams.set('withFileName', `${resourceNameText.plural_lower}-search-results`);

  if (type === DownloadType.CSV || type === DownloadType.TSV) {
    cardSearchUrl.searchParams.set(`fields[${resourceNameText.singular_upper}]`, fields.join(','));
  }

  const downloadLink = cardSearchUrl.toString();
  window.open(downloadLink, '_blank');
}
