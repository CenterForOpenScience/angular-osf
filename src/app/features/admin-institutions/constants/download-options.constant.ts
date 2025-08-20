import { DownloadType } from '../enums';

export const DOWNLOAD_OPTIONS = [
  {
    value: DownloadType.CSV,
    label: 'CSV',
    icon: 'fa fa-file-csv',
  },
  {
    value: DownloadType.TSV,
    label: 'TSV',
    icon: 'fa fa-file-alt',
  },
  {
    value: DownloadType.JSON,
    label: 'JSON',
    icon: 'fa fa-file-code',
  },
];
