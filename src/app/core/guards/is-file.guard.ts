import { Store } from '@ngxs/store';

import { map, switchMap } from 'rxjs/operators';

import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';

import { CurrentResourceType } from '../../shared/enums';
import { CurrentResourceSelectors, GetResource } from '../../shared/stores';

export const isFileGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const store = inject(Store);

  const id = segments[0]?.path;
  if (!id) {
    return false;
  }

  const currentResource = store.selectSnapshot(CurrentResourceSelectors.getCurrentResource);

  if (currentResource && currentResource.id === id) {
    if (currentResource.type === CurrentResourceType.Files) {
      return true;
    }

    return currentResource.type === CurrentResourceType.Files;
  }

  return store.dispatch(new GetResource(id)).pipe(
    switchMap(() => store.select(CurrentResourceSelectors.getCurrentResource)),
    map((resource) => {
      if (!resource || resource.id !== id) {
        return false;
      }

      if (resource.type === CurrentResourceType.Files) {
        return true;
      }
      return resource.type === CurrentResourceType.Files;
    })
  );
};
