import { Store } from '@ngxs/store';

import { map, switchMap } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { CurrentResourceSelectors, GetResource } from '@osf/shared/stores/current-resource';

export const isFileGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const store = inject(Store);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const id = segments[0]?.path;
  const isMetadataPath = segments[1]?.path === 'metadata';

  let viewOnly: string | null = null;

  if (isBrowser) {
    const urlObj = new URL(window.location.href);
    viewOnly = urlObj.searchParams.get('view_only');
  } else {
    const routerUrl = router.url;
    const queryParams = routerUrl.split('?')[1];

    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      viewOnly = params.get('view_only');
    }
  }

  const extras = viewOnly ? { queryParams: { view_only: viewOnly } } : {};

  if (!id) {
    return false;
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
          router.navigate(['/', resource.parentId, 'files', id], extras);
          return false;
        }
      }

      return resource.type === CurrentResourceType.Files;
    })
  );
};
