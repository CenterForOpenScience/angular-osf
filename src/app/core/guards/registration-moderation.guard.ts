import { Store } from '@ngxs/store';

import { map, switchMap, take } from 'rxjs';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { GetRegistryProvider, RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';

export const registrationModerationGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);

  const provider = store.selectSnapshot(RegistrationProviderSelectors.getBrandedProvider);

  if (provider?.reviewsWorkflow) {
    return true;
  }
  const id = route.params['providerId'];
  return store.dispatch(new GetRegistryProvider(id)).pipe(
    switchMap(() => {
      return store.select(RegistrationProviderSelectors.getBrandedProvider).pipe(
        take(1),
        map((provider) => {
          if (!provider?.reviewsWorkflow) {
            router.navigate(['/not-found']);
            return false;
          }

          return true;
        })
      );
    })
  );
};
