import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';

import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (req.url.includes('/api.crossref.org/funders')) {
    return next(req);
  }

  const platformId = inject(PLATFORM_ID);
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

  if (isPlatformServer(platformId)) {
    const environment = inject(ENVIRONMENT);

    if (environment.throttleToken) {
      headers['X-Throttle-Token'] = environment.throttleToken;
    }
  }

  const authReq = req.clone({ setHeaders: headers, withCredentials: true });

  return next(authReq);
};
