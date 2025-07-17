import { TableColumn } from '@osf/features/admin-institutions/models';

export const preprintsTableColumns: TableColumn[] = [
  {
    field: 'title',
    header: 'adminInstitutions.projects.title',
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
    isLink: true,
    linkTarget: '_blank',
    sortable: false,
  },
  {
    field: 'license',
    header: 'adminInstitutions.projects.license',
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
    field: 'viewsLast30Days',
    header: 'adminInstitutions.projects.views',
    sortable: false,
  },
  {
    field: 'downloadsLast30Days',
    header: 'adminInstitutions.preprints.downloadsLastDays',
    sortable: false,
  },
];
