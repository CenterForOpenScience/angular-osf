import { Router } from '@angular/router';

export function hasViewOnlyParam(router: Router): boolean {
  const currentUrl = router.url;
  const routerParams = new URLSearchParams(currentUrl.split('?')[1] || '');
  const windowParams = new URLSearchParams(window.location.search);

  return routerParams.has('view_only') || windowParams.has('view_only');
}

export function getViewOnlyParam(router?: Router): string | null {
  let currentUrl = '';

  if (router) {
    currentUrl = router.url;
  }

  const routerParams = new URLSearchParams(currentUrl.split('?')[1] || '');
  const windowParams = new URLSearchParams(window.location.search);

  return routerParams.get('view_only') || windowParams.get('view_only');
}

export function getViewOnlyParamFromUrl(currentUrl?: string): string | null {
  if (!currentUrl) return null;

  const routerParams = new URLSearchParams(currentUrl.split('?')[1] || '');
  const windowParams = new URLSearchParams(window.location.search);

  return routerParams.get('view_only') || windowParams.get('view_only');
}
