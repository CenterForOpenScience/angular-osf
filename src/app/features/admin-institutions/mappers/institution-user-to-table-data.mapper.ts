import { InstitutionUser, TableCellData } from '../models';

import { environment } from 'src/environments/environment';

export function mapUserToTableCellData(user: InstitutionUser): TableCellData {
  return {
    id: user.id,
    userName: user.userName || '-',
    department: user.department || '-',
    userLink: {
      text: user.userId,
      url: `${environment.webUrl}/${user.userId}`,
      target: '_blank',
    },
    orcidId: user.orcidId
      ? {
          text: user.orcidId,
          url: `https://orcid.org/${user.orcidId}`,
          target: '_blank',
        }
      : '-',
    publicProjects: user.publicProjects,
    privateProjects: user.privateProjects,
    publicRegistrationCount: user.publicRegistrationCount,
    embargoedRegistrationCount: user.embargoedRegistrationCount,
    publishedPreprintCount: user.publishedPreprintCount,
  };
}
