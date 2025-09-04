import { Store } from '@ngxs/store';

import { map, switchMap, take } from 'rxjs';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { GetCurrentUser, UserSelectors } from '@osf/core/store/user';
import { hasViewOnlyParam } from '@osf/shared/helpers';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuthenticated = store.selectSnapshot(UserSelectors.isAuthenticated);

  if (isAuthenticated) {
    return true;
  }

  if (hasViewOnlyParam(router)) {
    return true;
  }

  return store.dispatch(GetCurrentUser).pipe(
    switchMap(() => {
      return store.select(UserSelectors.isAuthenticated).pipe(
        take(1),
        map((isAuthenticated) => {
          if (!isAuthenticated) {
            router.navigate(['/']);
            return false;
          }

          return true;
        })
      );
    })
  );
};
