export function appendDownloadTrackingParams(link: string, source: string): string {
  const separator = link.includes('?') ? '&' : '?';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `${link}${separator}source=${encodeURIComponent(source)}&tz=${encodeURIComponent(tz)}`;
}
