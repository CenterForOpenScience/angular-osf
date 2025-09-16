import { ResourceModel } from '@shared/models';

import { extractPathAfterDomain } from '../helpers';
import { TableCellData } from '../models';

import { mapCreators } from './creators.mapper';

export function mapPreprintResourceToTableData(preprint: ResourceModel, currentInstitutionId: string): TableCellData {
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
    creator: mapCreators(preprint, currentInstitutionId),
    viewsLast30Days: preprint.viewsCount || '-',
    downloadsLast30Days: preprint.downloadCount || '-',
  };
}
