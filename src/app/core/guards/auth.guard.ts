import { Store } from '@ngxs/store';

import { filter, map, take } from 'rxjs';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(UserSelectors.getCurrentUserLoading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      const user = store.selectSnapshot(UserSelectors.getCurrentUser);
      if (!user) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
