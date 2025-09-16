import { getSortedContributorsByPermissions } from '@shared/helpers';
import { ResourceModel } from '@shared/models';

import { extractPathAfterDomain } from '../helpers';
import { TableCellData } from '../models';

export function mapPreprintResourceToTableData(preprint: ResourceModel): TableCellData {
  return {
    title: preprint.title,
    link: {
      text: preprint.absoluteUrl.split('/').pop() || preprint.absoluteUrl,
      url: preprint.absoluteUrl,
    },
    dateCreated: preprint.dateCreated,
    dateModified: preprint.dateModified,
    doi: preprint.doi[0]
      ? {
          text: extractPathAfterDomain(preprint.doi[0]),
          url: preprint.doi[0],
        }
      : '-',
    license: preprint.license?.name || '-',
    contributorName: getSortedContributorsByPermissions(preprint)?.map((creator) => ({
      text: creator.name.trim(),
      url: creator.absoluteUrl,
    })),
    viewsLast30Days: preprint.viewsCount || '-',
    downloadsLast30Days: preprint.downloadCount || '-',
  };
}
