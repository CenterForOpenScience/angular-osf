import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authToken = '2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt';
  // UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm kyrylo
  // 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt roman nastyuk
  // yZ485nN6MfhqvGrfU4Xk5BEnq0T6LM50nQ6H9VrYaMTaZUQNTuxnIwlp0Wpz879RCsK9GQ NM stage3
  const localStorageToken = localStorage.getItem('authToken');
  const token = localStorageToken || authToken;
  if (token) {
    if (!req.url.includes('/api.crossref.org/funders')) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Accept: req.responseType === 'text' ? '*/*' : 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      });

      return next(authReq);
    } else {
      return next(req);
    }
  }

  return next(req);
};
