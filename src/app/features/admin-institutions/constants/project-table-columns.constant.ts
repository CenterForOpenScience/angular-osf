import { TableColumn } from '@osf/features/admin-institutions/models';

export const projectTableColumns: TableColumn[] = [
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
    header: 'adminInstitutions.projects.license',
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
