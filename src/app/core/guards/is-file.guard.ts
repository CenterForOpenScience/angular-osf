import { Store } from '@ngxs/store';

import { map, switchMap } from 'rxjs/operators';

import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { CurrentResourceType } from '../../shared/enums';
import { CurrentResourceSelectors, GetResource } from '../../shared/stores';

export const isFileGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const store = inject(Store);
  const router = inject(Router);

  const id = segments[0]?.path;
  const isMetadataPath = segments[1]?.path === 'metadata';
  if (!id) {
    return false;
  }

  const currentResource = store.selectSnapshot(CurrentResourceSelectors.getCurrentResource);
  if (currentResource && currentResource.id === id) {
    if (currentResource.type === CurrentResourceType.Files) {
      if (isMetadataPath) {
        return true;
      }
      if (currentResource.parentId) {
        router.navigate(['/', currentResource.parentId, 'files', id], { queryParamsHandling: 'preserve' });
        return false;
      }
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
        if (isMetadataPath) {
          return true;
        }
        if (resource.parentId) {
          router.navigate(['/', resource.parentId, 'files', id], { queryParamsHandling: 'preserve' });
          return false;
        }
      }
      return resource.type === CurrentResourceType.Files;
    })
  );
};
