import { Store } from '@ngxs/store';

import { map, switchMap } from 'rxjs/operators';

import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CurrentResourceSelectors, GetResource } from '@shared/stores/current-resource';

export const isRegistryGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const store = inject(Store);
  const router = inject(Router);

  const id = segments[0]?.path;

  if (!id) {
    return false;
  }

  return store.dispatch(new GetResource(id)).pipe(
    switchMap(() => store.select(CurrentResourceSelectors.getCurrentResource)),
    map((resource) => {
      if (!resource || !resource.id.startsWith(id)) {
        return false;
      }

      if (resource.type === CurrentResourceType.Registrations && resource.parentId) {
        router.navigate(['/', resource.parentId, 'files', id], { queryParamsHandling: 'preserve' });
        return true;
      }

      if (resource.type === CurrentResourceType.Preprints && resource.parentId) {
        router.navigate(['/preprints', resource.parentId, id]);
        return true;
      }

      if (resource.type === CurrentResourceType.Users) {
        const currentUser = store.selectSnapshot(UserSelectors.getCurrentUser);

        if (currentUser && currentUser.id === resource.id) {
          router.navigate(['/profile']);
        } else {
          router.navigate(['/user', id]);
        }

        return false;
      }

      return resource.type === CurrentResourceType.Registrations;
    })
  );
};
