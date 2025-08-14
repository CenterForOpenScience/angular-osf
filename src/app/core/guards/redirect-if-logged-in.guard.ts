import { Store } from '@ngxs/store';

import { map, switchMap, take } from 'rxjs';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { GetCurrentUser, UserSelectors } from '@osf/core/store/user';

export const redirectIfLoggedInGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuthenticated = store.selectSnapshot(UserSelectors.isAuthenticated);

  if (isAuthenticated) {
    router.navigate(['/dashboard']);
    return false;
  }

  return store.dispatch(GetCurrentUser).pipe(
    switchMap(() => {
      return store.select(UserSelectors.isAuthenticated).pipe(
        take(1),
        map((isAuthenticated) => {
          if (isAuthenticated) {
            router.navigate(['/dashboard']);
            return false;
          }
          return true;
        })
      );
    })
  );
};
