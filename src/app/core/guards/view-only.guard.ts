import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { VIEW_ONLY_EXCLUDED_ROUTES } from '@core/constants/view-only-excluded-routes.const';
import { ViewOnlyService } from '@osf/shared/services/view-only.service';

export const viewOnlyGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const viewOnlyHelper = inject(ViewOnlyService);

  if (!viewOnlyHelper.hasViewOnlyParam(router)) {
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
  const viewOnlyParam = viewOnlyHelper.getViewOnlyParam(router);

  if (resourceId && viewOnlyParam) {
    router.navigate([resourceId, 'overview'], {
      queryParams: { view_only: viewOnlyParam },
    });
  } else {
    router.navigate(['/']);
  }

  return false;
};
