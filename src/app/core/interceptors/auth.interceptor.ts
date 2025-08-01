import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cookieService = inject(CookieService);
  // TODO: remove this after the migration to the new auth approach is complete
  // const authToken = 'UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm';
  // UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm kyrylo
  // 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt roman nastyuk
  // yZ485nN6MfhqvGrfU4Xk5BEnq0T6LM50nQ6H9VrYaMTaZUQNTuxnIwlp0Wpz879RCsK9GQ NM stage3
  const localStorageToken = localStorage.getItem('authToken');

  const token = localStorageToken;

  const csrfToken = cookieService.get('api-csrf');

  if (!req.url.includes('/api.crossref.org/funders')) {
    const headers: Record<string, string> = {
      Accept: req.responseType === 'text' ? '*/*' : 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    };
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    // TODO: remove this after the migration to the new auth approach is complete
    // if (token && !environment.production) {
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const authReq = req.clone({
      setHeaders: headers,
      withCredentials: true,
    });

    return next(authReq);
  } else {
    return next(req);
  }

  return next(req);
};
