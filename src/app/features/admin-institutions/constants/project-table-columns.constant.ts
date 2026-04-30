import { TableColumn } from '../models';

const defaultDateFormat = 'MMM d, y';

export const projectTableColumns: TableColumn[] = [
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
    linkTarget: '_blank',
    isArray: true,
    showIcon: true,
    iconClass: 'fa-solid fa-comment text-primary',
    iconTooltip: 'adminInstitutions.institutionUsers.sendMessage',
    iconAction: 'sendMessage',
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
    sortable: false,
  },
  {
    field: 'license',
    header: 'common.labels.license',
    sortable: false,
  },
  {
    field: 'addOns',
    header: 'adminInstitutions.projects.addOns',
    sortable: false,
  },
  {
    field: 'funderName',
    header: 'adminInstitutions.projects.funderName',
    sortable: false,
  },
];
