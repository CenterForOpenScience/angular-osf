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
    if (currentResource.type === CurrentResourceType.File) {
      router.navigate(['/files', id]);
      return false;
    }

    if (currentResource.type === CurrentResourceType.User) {
      router.navigate(['/user', id]);
      return false;
    }

    return currentResource.type === CurrentResourceType.Registration;
  }

  return store.dispatch(new GetResource(id)).pipe(
    switchMap(() => store.select(CurrentResourceSelectors.getCurrentResource)),
    map((resource) => {
      if (!resource || resource.id !== id) {
        return false;
      }

      if (resource.type === CurrentResourceType.File) {
        router.navigate(['/files', id]);
        return false;
      }

      if (resource.type === CurrentResourceType.User) {
        router.navigate(['/user', id]);
        return false;
      }

      return resource.type === CurrentResourceType.Registration;
    })
  );
};
