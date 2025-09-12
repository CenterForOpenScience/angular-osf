import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';
import { ResourceModel } from '@shared/models';

import { TableCellData, TableCellLink } from '../models';

export function mapRegistrationResourceToTableData(registration: ResourceModel): TableCellData {
  return {
    title: registration.title,
    link: {
      text: registration.absoluteUrl.split('/').pop() || registration.absoluteUrl,
      url: registration.absoluteUrl,
      target: '_blank',
    } as TableCellLink,
    dateCreated: registration.dateCreated,
    dateModified: registration.dateModified,
    doi: registration.doi[0]
      ? ({
          text: extractPathAfterDomain(registration.doi[0]),
          url: registration.doi[0],
        } as TableCellLink)
      : '-',
    storageLocation: registration.storageRegion || '-',
    totalDataStored: registration.storageByteCount
      ? `${(+registration.storageByteCount / (1024 * 1024)).toFixed(1)} MB`
      : '0 B',
    contributorName: registration.creators[0]
      ? ({
          text: registration.creators[0].name,
          url: registration.creators[0].absoluteUrl,
          target: '_blank',
        } as TableCellLink)
      : '-',
    views: registration.viewsCount || '-',
    resourceType: registration.resourceNature || '-',
    license: registration.license?.name || '-',
    funderName: registration.funders?.[0]?.name || '-',
    registrationSchema: registration.registrationTemplate || '-',
  };
}
