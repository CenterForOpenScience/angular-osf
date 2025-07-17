export function extractPathAfterDomain(url: string): string {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.replace(/^\/+/, '');
}
