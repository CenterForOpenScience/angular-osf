import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';

import { FileProviderRegistryService } from '@core/services/file-provider-registry.service';

/**
 * Route guard that checks if a file provider is valid.
 * Supports both built-in providers (osfstorage, googledrive, etc.) and
 * dynamically discovered external storage services (foreign addons like s3compat).
 */
export const isFileProvider: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const id = segments[0]?.path;
  if (!id) {
    return false;
  }

  const registry = inject(FileProviderRegistryService);

  return registry.isValidProvider(id);
};
