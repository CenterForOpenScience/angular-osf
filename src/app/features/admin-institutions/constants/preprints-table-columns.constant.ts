import { TableColumn } from '../models';

const defaultDateFormat = 'MMM d, y';

export const preprintsTableColumns: TableColumn[] = [
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
    field: 'license',
    header: 'common.labels.license',
  },
  {
    field: 'creator',
    header: 'adminInstitutions.projects.contributorName',
    isLink: true,
    isArray: true,
    linkTarget: '_blank',
  },
  {
    field: 'viewsLast30Days',
    header: 'adminInstitutions.projects.views',
    sortable: true,
    sortField: 'usage.viewCount',
  },
  {
    field: 'downloadsLast30Days',
    header: 'adminInstitutions.preprints.downloadsLastDays',
    sortable: true,
    sortField: 'usage.downloadCount',
  },
];
