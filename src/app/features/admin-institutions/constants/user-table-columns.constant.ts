import { TableColumn } from '../models';

export const userTableColumns: TableColumn[] = [
  {
    field: 'userName',
    header: 'settings.profileSettings.tabs.name',
    sortable: true,
    isLink: true,
    linkTarget: '_blank',
    showIcon: true,
    iconClass: 'fa-solid fa-comment text-primary',
    iconTooltip: 'adminInstitutions.institutionUsers.sendMessage',
    iconAction: 'sendMessage',
  },
  { field: 'department', header: 'settings.profileSettings.education.department', sortable: true },
  { field: 'userLink', header: 'adminInstitutions.institutionUsers.osfLink', isLink: true, linkTarget: '_blank' },
  { field: 'orcidId', header: 'adminInstitutions.institutionUsers.orcid', isLink: true, linkTarget: '_blank' },
  { field: 'publicProjects', header: 'adminInstitutions.summary.publicProjects', sortable: true },
  { field: 'privateProjects', header: 'adminInstitutions.summary.privateProjects', sortable: true },
  { field: 'publicRegistrationCount', header: 'adminInstitutions.summary.publicRegistrations', sortable: true },
  { field: 'embargoedRegistrationCount', header: 'adminInstitutions.summary.embargoedRegistrations', sortable: true },
  { field: 'publishedPreprintCount', header: 'adminInstitutions.institutionUsers.preprints', sortable: true },
  { field: 'publicFileCount', header: 'adminInstitutions.institutionUsers.filesOnOsf', sortable: true },
  { field: 'totalDataStored', header: 'adminInstitutions.institutionUsers.totalDataStored', sortable: true },
  {
    field: 'accountCreationDate',
    header: 'adminInstitutions.institutionUsers.accountCreated',
    sortable: true,
    dateFormat: 'dd/MM/yyyy',
  },
  {
    field: 'monthLasLogin',
    header: 'adminInstitutions.institutionUsers.lastLogin',
    sortable: true,
    dateFormat: 'dd/MM/yyyy',
  },
  {
    field: 'monthLastActive',
    header: 'adminInstitutions.institutionUsers.lastActive',
    sortable: true,
    dateFormat: 'dd/MM/yyyy',
  },
];
