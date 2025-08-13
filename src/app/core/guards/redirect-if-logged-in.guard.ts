import { select } from '@ngxs/store';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';

export const redirectIfLoggedInGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isAuthenticated = select(UserSelectors.isAuthenticated);

  if (isAuthenticated()) {
    return router.navigate(['/dashboard']);
  }

  return true;
};
