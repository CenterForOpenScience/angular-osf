import { ResourceModel } from '@shared/models';

import { extractPathAfterDomain } from '../helpers';
import { TableCellData, TableCellLink } from '../models';

export function mapPreprintResourceToTableData(preprint: ResourceModel): TableCellData {
  return {
    title: preprint.title,
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
          url: preprint.creators[0].absoluteUrl,
          target: '_blank',
        } as TableCellLink)
      : '-',
    viewsLast30Days: preprint.viewsCount || '-',
    downloadsLast30Days: preprint.downloadCount || '-',
  };
}
