import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authToken = 'UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm';
  // UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm kyrylo
  // 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt roman nastyuk

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        Accept: req.responseType === 'text' ? '*/*' : 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    });

    return next(authReq);
  }

  return next(req);
};
