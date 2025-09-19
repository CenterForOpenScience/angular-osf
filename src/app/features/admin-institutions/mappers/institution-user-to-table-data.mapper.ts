import { InstitutionUser, TableCellData } from '../models';

export function mapUserToTableCellData(user: InstitutionUser, webUrl: string): TableCellData {
  return {
    id: user.id,
    userName: user.userName || '-',
    department: user.department || '-',
    userLink: {
      text: user.userId,
      url: `${webUrl}/${user.userId}`,
    },
    orcidId: user.orcidId
      ? {
          text: user.orcidId,
          url: `https://orcid.org/${user.orcidId}`,
        }
      : '-',
    publicProjects: user.publicProjects,
    privateProjects: user.privateProjects,
    publicRegistrationCount: user.publicRegistrationCount,
    embargoedRegistrationCount: user.embargoedRegistrationCount,
    publishedPreprintCount: user.publishedPreprintCount,
    publicFileCount: user.publicFileCount,
    totalDataStored: user.storageByteCount ? `${(user.storageByteCount / (1024 * 1024)).toFixed(1)} MB` : '0 B',
    monthLasLogin: user.monthLasLogin,
    monthLastActive: user.monthLastActive,
    accountCreationDate: user.accountCreationDate,
  };
}
