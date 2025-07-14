import { TableColumn } from '@osf/features/admin-institutions/models';

export const userTableColumns: TableColumn[] = [
  {
    field: 'userName',
    header: 'settings.profileSettings.tabs.name',
    sortable: true,
    isLink: false,
    linkTarget: '_blank',
    showIcon: true,
    iconClass: 'fa-solid fa-comment text-primary',
    iconTooltip: 'adminInstitutions.institutionUsers.sendMessage',
    iconAction: 'sendMessage',
  },
  { field: 'department', header: 'settings.profileSettings.education.department', sortable: true },
  { field: 'userLink', header: 'adminInstitutions.institutionUsers.osfLink', isLink: false, linkTarget: '_blank' },
  { field: 'orcidId', header: 'adminInstitutions.institutionUsers.orcid', isLink: true, linkTarget: '_blank' },
  { field: 'publicProjects', header: 'adminInstitutions.summary.publicProjects', sortable: true },
  { field: 'privateProjects', header: 'adminInstitutions.summary.privateProjects', sortable: true },
  {
    field: 'monthLastLogin',
    header: 'adminInstitutions.institutionUsers.lastLogin',
    sortable: true,
    dateFormat: 'yyyy-mm-to-mm/yyyy',
  },
  {
    field: 'monthLastActive',
    header: 'adminInstitutions.institutionUsers.lastActive',
    sortable: true,
    dateFormat: 'yyyy-mm-to-mm/yyyy',
  },
  {
    field: 'accountCreationDate',
    header: 'adminInstitutions.institutionUsers.accountCreated',
    sortable: true,
    dateFormat: 'yyyy-mm-to-mm/yyyy',
  },
  { field: 'publicRegistrationCount', header: 'adminInstitutions.summary.publicRegistrations', sortable: true },
  { field: 'embargoedRegistrationCount', header: 'adminInstitutions.summary.embargoedRegistrations', sortable: true },
  { field: 'publishedPreprintCount', header: 'adminInstitutions.institutionUsers.publishedPreprints', sortable: true },
  { field: 'publicFileCount', header: 'adminInstitutions.institutionUsers.publicFiles', sortable: true },
  { field: 'storageByteCount', header: 'adminInstitutions.institutionUsers.storageBytes', sortable: true },
  { field: 'contactsCount', header: 'adminInstitutions.institutionUsers.contacts', sortable: true },
];
