import { Store } from '@ngxs/store';

import { map, switchMap, take } from 'rxjs';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { GetCurrentUser, UserSelectors } from '@osf/core/store/user';
import { hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

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
            authService.navigateToSignIn();
            return false;
          }

          return true;
        })
      );
    })
  );
};
