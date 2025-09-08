import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';
import { Resource } from '@shared/models';

import { TableCellData, TableCellLink } from '../models';

export function mapPreprintResourceToTableData(preprint: Resource): TableCellData {
  return {
    title: {
      text: preprint.title,
      url: preprint.absoluteUrl,
      target: '_blank',
    } as TableCellLink,
    link: {
      text: preprint.absoluteUrl.split('/').pop() || preprint.absoluteUrl,
      url: preprint.absoluteUrl,
      target: '_blank',
    } as TableCellLink,
    dateCreated: preprint.dateCreated,
    dateModified: preprint.dateModified,
    doi: preprint.doi[0]
      ? ({
          text: extractPathAfterDomain(preprint.doi[0]),
          url: preprint.doi[0],
        } as TableCellLink)
      : '-',
    license: preprint.license?.name || '-',
    contributorName: preprint.creators[0]
      ? ({
          text: preprint.creators[0].name,
          url: `https://osf.io/${preprint.creators[0].absoluteUrl}`,
          target: '_blank',
        } as TableCellLink)
      : '-',
    viewsLast30Days: 'Will be parsed soon',
    downloadsLast30Days: 'Will be parsed soon',
  };
}
