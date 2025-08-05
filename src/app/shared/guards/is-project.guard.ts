import { Store } from '@ngxs/store';

import { lastValueFrom } from 'rxjs';

import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';

import { ResourceType } from '../enums';
import { ResourceTypeService } from '../services/resource-type.service';
import { ResourceTypeSelectors, SetResourceType } from '../stores';

export const isProjectGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const resourceTypeService = inject(ResourceTypeService);
  const store = inject(Store);

  const id = segments[0]?.path;

  if (!id) {
    return false;
  }

  const currentResourceId = store.selectSnapshot(ResourceTypeSelectors.getCurrentResourceId);
  const currentResourceType = store.selectSnapshot(ResourceTypeSelectors.getCurrentResourceType);

  if (currentResourceId === id && currentResourceType !== null) {
    return currentResourceType === ResourceType.Project;
  }

  try {
    const resourceType = await lastValueFrom(resourceTypeService.getResourceType(id));
    const isProject = resourceType === ResourceType.Project;

    store.dispatch(new SetResourceType(id, resourceType));

    return isProject;
  } catch {
    return false;
  }
};
