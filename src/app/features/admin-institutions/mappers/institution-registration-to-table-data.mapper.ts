import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';

import { InstitutionRegistration, TableCellData, TableCellLink } from '../models';

export function mapRegistrationToTableData(registration: InstitutionRegistration): TableCellData {
  return {
    id: registration.id,
    title: {
      text: registration.title,
      url: registration.link,
      target: '_blank',
    } as TableCellLink,
    link: {
      text: registration.link.split('/').pop() || registration.link,
      url: registration.link,
      target: '_blank',
    } as TableCellLink,
    dateCreated: registration.dateCreated,
    dateModified: registration.dateModified,
    doi: registration.doi
      ? ({
          text: extractPathAfterDomain(registration.doi),
          url: registration.doi,
        } as TableCellLink)
      : '-',
    storageLocation: registration.storageLocation || '-',
    totalDataStored: registration.totalDataStored || '-',
    contributorName: registration.contributorName
      ? ({
          text: registration.contributorName,
          url: `https://osf.io/${registration.contributorName}`,
          target: '_blank',
        } as TableCellLink)
      : '-',
    views: registration.views || '-',
    resourceType: registration.resourceType || '-',
    license: registration.license || '-',
    funderName: registration.funderName || '-',
    registrationSchema: registration.registrationSchema || '-',
  };
}
