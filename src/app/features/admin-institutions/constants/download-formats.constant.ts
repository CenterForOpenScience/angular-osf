import { DownloadType } from '../enums';

export const DOWNLOAD_FORMATS: Record<DownloadType, string> = {
  [DownloadType.CSV]: 'text/csv',
  [DownloadType.TSV]: 'text/tab-separated-values',
  [DownloadType.JSON]: 'application/json',
};
