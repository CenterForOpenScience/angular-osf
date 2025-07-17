import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';

import { InstitutionPreprint, TableCellData, TableCellLink } from '../models';

export function mapPreprintToTableData(preprint: InstitutionPreprint): TableCellData {
  return {
    id: preprint.id,
    title: {
      text: preprint.title,
      url: preprint.link,
      target: '_blank',
    } as TableCellLink,
    link: {
      text: preprint.link.split('/').pop() || preprint.link,
      url: preprint.link,
      target: '_blank',
    } as TableCellLink,
    dateCreated: preprint.dateCreated,
    dateModified: preprint.dateModified,
    doi: preprint.doi
      ? ({
          text: extractPathAfterDomain(preprint.doi),
          url: preprint.doi,
        } as TableCellLink)
      : '-',
    license: preprint.license || '-',
    contributorName: preprint.contributorName
      ? ({
          text: preprint.contributorName,
          url: `https://osf.io/${preprint.contributorName}`,
          target: '_blank',
        } as TableCellLink)
      : '-',
    viewsLast30Days: preprint.viewsLast30Days || '-',
    downloadsLast30Days: preprint.downloadsLast30Days || '-',
  };
}
