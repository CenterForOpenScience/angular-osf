import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { VIEW_ONLY_EXCLUDED_ROUTES } from '@core/constants/view-only-excluded-routes.const';
import { hasViewOnlyParam } from '@osf/shared/helpers';

export const viewOnlyGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  if (!hasViewOnlyParam(router)) {
    return true;
  }

  const routePath = route.routeConfig?.path || '';

  const isBlocked = VIEW_ONLY_EXCLUDED_ROUTES.some(
    (blockedRoute) => routePath === blockedRoute || routePath.startsWith(`${blockedRoute}/`)
  );

  if (!isBlocked) {
    return true;
  }

  const urlSegments = router.url.split('/');
  const resourceId = urlSegments[1];
  const viewOnlyParam = new URLSearchParams(window.location.search).get('view_only');

  if (resourceId && viewOnlyParam) {
    router.navigate([resourceId, 'overview'], {
      queryParams: { view_only: viewOnlyParam },
    });
  } else {
    router.navigate(['/']);
  }

  return false;
};
