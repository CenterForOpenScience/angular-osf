import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';
import { ResourceModel } from '@shared/models';

import { TableCellData } from '../models';

import { mapCreators } from './creators.mapper';

export function mapRegistrationResourceToTableData(
  registration: ResourceModel,
  currentInstitutionId: string
): TableCellData {
  return {
    title: registration.title,
    link: {
      text: registration.absoluteUrl.split('/').pop() || registration.absoluteUrl,
      url: registration.absoluteUrl,
    },
    dateCreated: registration.dateCreated,
    dateModified: registration.dateModified,
    doi: registration.doi[0]
      ? {
          text: extractPathAfterDomain(registration.doi[0]),
          url: registration.doi[0],
        }
      : '-',
    storageLocation: registration.storageRegion || '-',
    totalDataStored: registration.storageByteCount
      ? `${(+registration.storageByteCount / (1024 * 1024)).toFixed(1)} MB`
      : '0 B',
    creator: mapCreators(registration, currentInstitutionId),
    views: registration.viewsCount || '-',
    resourceType: registration.resourceNature || '-',
    license: registration.license?.name || '-',
    funderName: registration.funders?.[0]?.name || '-',
    registrationSchema: registration.registrationTemplate || '-',
  };
}
