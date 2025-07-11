import { InstitutionUser, TableCellData } from '@osf/features/admin-institutions/models';

export function mapUserToTableCellData(user: InstitutionUser): TableCellData {
  return {
    id: user.id,
    userName: user.userName
      ? {
          text: user.userName,
          url: user.userLink,
          target: '_blank',
        }
      : '-',
    department: user.department || '-',
    userLink: user.userLink
      ? {
          text: user.userId,
          url: user.userLink,
          target: '_blank',
        }
      : '-',
    orcidId: user.orcidId
      ? {
          text: user.orcidId,
          url: `https://orcid.org/${user.orcidId}`,
          target: '_blank',
        }
      : '-',
    monthLastLogin: user.monthLastLogin,
    monthLastActive: user.monthLastActive,
    accountCreationDate: user.accountCreationDate,
    publicProjects: user.publicProjects,
    privateProjects: user.privateProjects,
    publicRegistrationCount: user.publicRegistrationCount,
    embargoedRegistrationCount: user.embargoedRegistrationCount,
    publishedPreprintCount: user.publishedPreprintCount,
    publicFileCount: user.publicFileCount,
    storageByteCount: user.storageByteCount,
    contactsCount: user.contactsCount,
  };
}
