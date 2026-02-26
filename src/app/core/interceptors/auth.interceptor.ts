import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (req.url.startsWith(environment.funderApiUrl)) {
    return next(req);
  }

  const cookieService = inject(CookieService);
  const csrfToken = cookieService.get('api-csrf');

  const headers: Record<string, string> = {
    Accept: req.responseType === 'text' ? '*/*' : 'application/vnd.api+json;version=2.20',
  };

  if (!req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/vnd.api+json';
  }

  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }

  const authReq = req.clone({ setHeaders: headers, withCredentials: true });

  return next(authReq);
};
