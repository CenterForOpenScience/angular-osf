import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';
import { Resource } from '@shared/models';

import { TableCellData, TableCellLink } from '../models';

export function mapRegistrationResourceToTableData(registration: Resource): TableCellData {
  return {
    title: {
      text: registration.title,
      url: registration.absoluteUrl,
      target: '_blank',
    } as TableCellLink,
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
    storageLocation: 'Will be parsed soon',
    totalDataStored: 'Will be parsed soon',
    contributorName: registration.creators[0]
      ? ({
          text: registration.creators[0].name,
          url: `https://osf.io/${registration.creators[0].absoluteUrl}`,
          target: '_blank',
        } as TableCellLink)
      : '-',
    views: 'Will be parsed soon',
    resourceType: registration.resourceNature || '-',
    license: registration.license?.name || '-',
    funderName: registration.funders?.[0]?.name || '-',
    registrationSchema: registration.registrationTemplate || '-',
  };
}
