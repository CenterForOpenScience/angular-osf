import { TableColumn } from '../models';

const defaultDateFormat = 'MMM d, y';

export const registrationTableColumns: TableColumn[] = [
  {
    field: 'title',
    header: 'common.labels.title',
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
    header: 'common.labels.dateCreated',
    sortable: true,
    dateFormat: defaultDateFormat,
  },
  {
    field: 'dateModified',
    header: 'common.labels.dateModified',
    sortable: true,
    dateFormat: defaultDateFormat,
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
    header: 'common.labels.license',
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
