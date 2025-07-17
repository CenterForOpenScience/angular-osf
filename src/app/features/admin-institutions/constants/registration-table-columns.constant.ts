import { TableColumn } from '@osf/features/admin-institutions/models';

export const registrationTableColumns: TableColumn[] = [
  {
    field: 'title',
    header: 'adminInstitutions.projects.title',
    sortable: false,
    isLink: true,
    linkTarget: '_blank',
  },
  {
    field: 'link',
    header: 'adminInstitutions.projects.link',
    sortable: false,
    isLink: true,
    linkTarget: '_blank',
  },
  {
    field: 'dateCreated',
    header: 'adminInstitutions.projects.dateCreated',
    sortable: true,
    dateFormat: 'dd/MM/yyyy',
  },
  {
    field: 'dateModified',
    header: 'adminInstitutions.projects.dateModified',
    sortable: true,
    dateFormat: 'dd/MM/yyyy',
  },
  {
    field: 'doi',
    header: 'adminInstitutions.projects.doi',
    sortable: false,
    isLink: true,
    linkTarget: '_blank',
  },
  {
    field: 'storageLocation',
    header: 'adminInstitutions.projects.storageLocation',
    sortable: false,
  },
  {
    field: 'totalDataStored',
    header: 'adminInstitutions.projects.totalDataStored',
    sortable: false,
  },
  {
    field: 'contributorName',
    header: 'adminInstitutions.projects.contributorName',
    sortable: true,
    isLink: true,
    linkTarget: '_blank',
  },
  {
    field: 'views',
    header: 'adminInstitutions.projects.views',
    sortable: false,
  },
  {
    field: 'resourceType',
    header: 'adminInstitutions.projects.resourceType',
    sortable: false,
  },
  {
    field: 'license',
    header: 'adminInstitutions.projects.license',
    sortable: false,
  },
  {
    field: 'funderName',
    header: 'adminInstitutions.registrations.funderName',
    sortable: false,
  },
  {
    field: 'registrationSchema',
    header: 'adminInstitutions.registrations.registrationSchema',
    sortable: false,
  },
];
