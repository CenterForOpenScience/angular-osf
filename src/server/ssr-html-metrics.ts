import { SsrHtmlInspection } from './ssr-metrics.model';

export const shouldInspectHtml = (isSearchBot: boolean, status: number) => isSearchBot && status === 200;

const META_OPTIONAL_EXACT = new Set([
  '/search',
  '/preprints/discover',
  '/registries/discover',
  '/terms-of-use',
  '/privacy-policy',
  '/choose-repository',
  '/forbidden',
  '/not-found',
  '/forgotpassword',
]);

const META_OPTIONAL_PREFIXES = ['/meetings', '/institutions', '/user', '/collections'];

const isMetaOptionalPath = (path: string) => {
  const pathname = path.split('?')[0].replace(/\/$/, '') || '/';

  if (META_OPTIONAL_EXACT.has(pathname)) {
    return true;
  }

  if (META_OPTIONAL_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'preprints' || segments[0] === 'registries') {
    if (segments.length === 2) {
      return true;
    }

    if (segments.length === 3 && segments[2] === 'discover') {
      return true;
    }
  }

  return false;
};

const getContentType = (html: string) => {
  const match =
    html.match(/<meta[^>]*name=["']osf:type["'][^>]*content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']osf:type["']/i);

  return match?.[1] ?? null;
};

export const inspectSsrHtml = (html: string, path: string): SsrHtmlInspection => {
  const contentType = getContentType(html);
  const isSsr = /<osf-root[^>]*ng-server-context/i.test(html);
  const rootContent = html.match(/<osf-root[^>]*>([\s\S]*?)<\/osf-root>/i)?.[1]?.replace(/\s+/g, '') ?? '';
  const hasContent = rootContent.length > 0;
  const hasMeta = html.includes('osf-dynamic-meta');

  if (!isSsr) {
    return { isComplete: false, contentType: null };
  }

  if (!hasContent) {
    return { isComplete: false, contentType };
  }

  if (hasMeta || isMetaOptionalPath(path)) {
    return { isComplete: true, contentType };
  }

  return { isComplete: false, contentType };
};
