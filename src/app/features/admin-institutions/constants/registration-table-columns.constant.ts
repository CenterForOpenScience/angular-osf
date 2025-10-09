import { TableColumn } from '@osf/features/admin-institutions/models';

export const registrationTableColumns: TableColumn[] = [
  {
    field: 'title',
    header: 'adminInstitutions.projects.title',
    isLink: true,
    linkTarget: '_blank',
  },
  {
    field: 'link',
    header: 'adminInstitutions.projects.link',
    isLink: true,
    linkTarget: '_blank',
  },
  {
    field: 'dateCreated',
    header: 'adminInstitutions.projects.dateCreated',
    sortable: true,
    dateFormat: 'MMM d, y',
  },
  {
    field: 'dateModified',
    header: 'adminInstitutions.projects.dateModified',
    sortable: true,
    dateFormat: 'MMM d, y',
  },
  {
    field: 'doi',
    header: 'adminInstitutions.projects.doi',
    isLink: true,
    linkTarget: '_blank',
  },
  {
    field: 'storageLocation',
    header: 'adminInstitutions.projects.storageLocation',
  },
  {
    field: 'totalDataStored',
    header: 'adminInstitutions.projects.totalDataStored',
    sortable: true,
    sortField: 'storageByteCount',
  },
  {
    field: 'creator',
    header: 'adminInstitutions.projects.contributorName',
    isLink: true,
    isArray: true,
    linkTarget: '_blank',
  },
  {
    field: 'views',
    header: 'adminInstitutions.projects.views',
    sortable: true,
    sortField: 'usage.viewCount',
  },
  {
    field: 'resourceType',
    header: 'adminInstitutions.projects.resourceType',
  },
  {
    field: 'license',
    header: 'adminInstitutions.projects.license',
  },
  {
    field: 'funderName',
    header: 'adminInstitutions.registrations.funderName',
  },
  {
    field: 'registrationSchema',
    header: 'adminInstitutions.registrations.registrationSchema',
  },
];
