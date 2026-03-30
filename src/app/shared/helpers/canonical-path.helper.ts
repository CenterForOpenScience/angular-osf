import { ActivatedRouteSnapshot } from '@angular/router';

interface ResolveCanonicalPathOptions {
  fallbackPath?: string;
  paramDefaults?: Record<string, string>;
}

export function resolveCanonicalPathFromSnapshot(
  routeSnapshot: ActivatedRouteSnapshot | null,
  options: ResolveCanonicalPathOptions = {}
): string {
  const fallbackPath = options.fallbackPath ?? 'overview';
  let current = routeSnapshot?.firstChild ?? null;
  let resolvedPath = fallbackPath;

  while (current) {
    const canonicalPath = current.data['canonicalPath'] as string | undefined;
    const canonicalPathTemplate = current.data['canonicalPathTemplate'] as string | undefined;

    if (canonicalPathTemplate) {
      const templatePath = resolveTemplatePath(current, canonicalPathTemplate, options.paramDefaults);
      if (templatePath) {
        resolvedPath = templatePath;
      }
    } else if (canonicalPath) {
      resolvedPath = canonicalPath;
    }

    current = current.firstChild ?? null;
  }

  return resolvedPath;
}

export function getDeepestCanonicalPathTemplateFromSnapshot(
  routeSnapshot: ActivatedRouteSnapshot | null
): string | null {
  let current = routeSnapshot?.firstChild ?? null;
  let template: string | null = null;

  while (current) {
    const currentTemplate = current.data['canonicalPathTemplate'] as string | undefined;

    if (currentTemplate) {
      template = currentTemplate;
    }

    current = current.firstChild ?? null;
  }

  return template;
}

function resolveTemplatePath(
  snapshot: ActivatedRouteSnapshot,
  template: string,
  paramDefaults?: Record<string, string>
): string {
  const params = snapshot.pathFromRoot.reduce<Record<string, string>>((acc, segment) => {
    const segmentParams = segment.params as Record<string, string>;
    Object.entries(segmentParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
    });
    return acc;
  }, {});

  return template
    .replace(/:([A-Za-z0-9_]+)/g, (_match, paramName: string) => {
      const value = params[paramName] ?? paramDefaults?.[paramName] ?? '';
      return encodeURIComponent(String(value));
    })
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
}
