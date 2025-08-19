import { DOWNLOAD_FORMATS } from '../constants';
import { DownloadType } from '../enums';

export function downloadResults(downloadUrl: string | null, type: DownloadType) {
  if (!downloadUrl) {
    return;
  }

  const cardSearchUrl = new URL(downloadUrl as string);
  const format = DOWNLOAD_FORMATS[type];

  cardSearchUrl.searchParams.set('page[size]', '10000');
  cardSearchUrl.searchParams.set('page[cursor]', '');
  cardSearchUrl.searchParams.set('acceptMediatype', format);
  cardSearchUrl.searchParams.set('withFileName', `projects-search-results`);

  const downloadLink = cardSearchUrl.toString();
  window.open(downloadLink, '_blank');
}
