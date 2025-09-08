import { TableColumn } from '@osf/features/admin-institutions/models';

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
];
