import { Store } from '@ngxs/store';

import { map, switchMap } from 'rxjs/operators';

import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { CurrentResourceType } from '../../shared/enums';
import { CurrentResourceSelectors, GetResource } from '../../shared/stores';

export const isRegistryGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const store = inject(Store);
  const router = inject(Router);

  const id = segments[0]?.path;

  if (!id) {
    return false;
  }

  const currentResource = store.selectSnapshot(CurrentResourceSelectors.getCurrentResource);

  if (currentResource && currentResource.id === id) {
    if (currentResource.type === CurrentResourceType.Registrations && currentResource.parentId) {
      router.navigate(['/', currentResource.parentId, 'files', id]);
      return true;
    }

    if (currentResource.type === CurrentResourceType.Preprints && currentResource.parentId) {
      router.navigate(['/preprints', currentResource.parentId, id]);
      return true;
    }

    if (currentResource.type === CurrentResourceType.Users) {
      router.navigate(['/user', id]);
      return false;
    }

    return currentResource.type === CurrentResourceType.Registrations;
  }

  return store.dispatch(new GetResource(id)).pipe(
    switchMap(() => store.select(CurrentResourceSelectors.getCurrentResource)),
    map((resource) => {
      if (!resource || resource.id !== id) {
        return false;
      }

      if (resource.type === CurrentResourceType.Registrations && resource.parentId) {
        router.navigate(['/', resource.parentId, 'files', id]);
        return true;
      }

      if (resource.type === CurrentResourceType.Preprints && resource.parentId) {
        router.navigate(['/preprints', resource.parentId, id]);
        return true;
      }

      if (resource.type === CurrentResourceType.Users) {
        router.navigate(['/profile', id]);
        return false;
      }

      return resource.type === CurrentResourceType.Registrations;
    })
  );
};
