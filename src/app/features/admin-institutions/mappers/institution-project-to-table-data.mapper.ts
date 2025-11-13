import { ResourceModel } from '@osf/shared/models/search/resource.model';

import { extractPathAfterDomain } from '../helpers';
import { TableCellData } from '../models';

import { mapCreators } from './creators.mapper';

export function mapProjectResourceToTableCellData(project: ResourceModel, currentInstitutionId: string): TableCellData {
  return {
    title: project.title,
    link: {
      url: project.absoluteUrl,
      text: project.absoluteUrl.split('/').pop() || project.absoluteUrl,
    },
    dateCreated: project.dateCreated!,
    dateModified: project.dateModified!,
    doi: project.doi[0]
      ? {
          text: extractPathAfterDomain(project.doi[0]),
          url: project.doi[0],
        }
      : '-',
    storageLocation: project.storageRegion || '-',
    totalDataStored: project.storageByteCount ? `${(+project.storageByteCount / (1024 * 1024)).toFixed(1)} MB` : '0 B',
    creator: mapCreators(project, currentInstitutionId),
    views: project.viewsCount || '-',
    resourceType: project.resourceNature || '-',
    license: project.license?.name || '-',
    addOns: project.addons?.join(',') || '-',
    funderName: project.funders?.[0]?.name || '-',
  };
}
