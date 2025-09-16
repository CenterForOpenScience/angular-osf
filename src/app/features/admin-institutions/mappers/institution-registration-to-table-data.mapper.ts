import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';
import { getSortedContributorsByPermissions } from '@shared/helpers';
import { ResourceModel } from '@shared/models';

import { TableCellData } from '../models';

export function mapRegistrationResourceToTableData(registration: ResourceModel): TableCellData {
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
    contributorName: getSortedContributorsByPermissions(registration)?.map((creator) => ({
      text: creator.name.trim(),
      url: creator.absoluteUrl,
    })),
    views: registration.viewsCount || '-',
    resourceType: registration.resourceNature || '-',
    license: registration.license?.name || '-',
    funderName: registration.funders?.[0]?.name || '-',
    registrationSchema: registration.registrationTemplate || '-',
  };
}
