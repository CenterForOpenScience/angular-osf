import { CanMatchFn, Route, UrlSegment } from '@angular/router';

import { FileProvider } from '@osf/features/files/constants';

export const isFileProvider: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const id = segments[0]?.path;

  return !!(id && Object.values(FileProvider).some((provider) => provider === id));
};
