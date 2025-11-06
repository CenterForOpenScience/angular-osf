import { Store } from '@ngxs/store';

import { map, switchMap } from 'rxjs/operators';

import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CurrentResourceSelectors, GetResource } from '@osf/shared/stores/current-resource';

export const isProjectGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const store = inject(Store);
  const router = inject(Router);

  const id = segments[0]?.path;

  if (!id) {
    return false;
  }

  const currentResource = store.selectSnapshot(CurrentResourceSelectors.getCurrentResource);
  const currentUser = store.selectSnapshot(UserSelectors.getCurrentUser);

  if (currentResource && !id.startsWith(currentResource.id)) {
    if (currentResource.type === CurrentResourceType.Projects && currentResource.parentId) {
      router.navigate(['/', currentResource.parentId, 'files', id], { queryParamsHandling: 'preserve' });
      return true;
    }

    if (currentResource.type === CurrentResourceType.Preprints && currentResource.parentId) {
      router.navigate(['/preprints', currentResource.parentId, id]);
      return true;
    }

    if (currentResource.type === CurrentResourceType.Users) {
      if (currentUser && currentUser.id === currentResource.id) {
        router.navigate(['/profile']);
      } else {
        router.navigate(['/user', id]);
      }
      return false;
    }

    return currentResource.type === CurrentResourceType.Projects;
  }

  return store.dispatch(new GetResource(id)).pipe(
    switchMap(() => store.select(CurrentResourceSelectors.getCurrentResource)),
    map((resource) => {
      if (!resource || !id.startsWith(resource.id)) {
        return false;
      }

      if (resource.type === CurrentResourceType.Projects && resource.parentId) {
        router.navigate(['/', resource.parentId, 'files', id], { queryParamsHandling: 'preserve' });
        return true;
      }

      if (resource.type === CurrentResourceType.Preprints && resource.parentId) {
        router.navigate(['/preprints', resource.parentId, id]);
        return true;
      }

      if (resource.type === CurrentResourceType.Users) {
        if (currentUser && currentUser.id === resource.id) {
          router.navigate(['/profile']);
        } else {
          router.navigate(['/user', id]);
        }
        return false;
      }

      return resource.type === CurrentResourceType.Projects;
    })
  );
};
