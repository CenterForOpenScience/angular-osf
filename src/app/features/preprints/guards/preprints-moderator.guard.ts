import { Store } from '@ngxs/store';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';

export const preprintsModeratorGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const canUserViewReviews = store.selectSnapshot(UserSelectors.getCanViewReviews);

  if (!canUserViewReviews) {
    router.navigateByUrl('/forbidden');
  }

  return canUserViewReviews;
};
