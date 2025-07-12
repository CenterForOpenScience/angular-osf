import { HttpInterceptorFn } from '@angular/common/http';

import { cookieAuthInterceptor } from './cookie-auth.interceptor';

import { environment } from 'src/environments/environment';

export const hybridAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.cookieAuth.enabled) {
    return cookieAuthInterceptor(req, next);
  }

  console.warn('Using fallback token authentication - this should not happen in production!');

  const authToken = 'UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm';

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    });

    return next(authReq);
  }

  return next(req);
};
