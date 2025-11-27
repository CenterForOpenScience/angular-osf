import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cookieService = inject(CookieService);
  const platformId = inject(PLATFORM_ID);

  const csrfToken = isPlatformBrowser(platformId) ? cookieService.get('api-csrf') : null;

  if (!req.url.includes('/api.crossref.org/funders')) {
    const headers: Record<string, string> = {};

    headers['Accept'] = req.responseType === 'text' ? '*/*' : 'application/vnd.api+json;version=2.20';

    if (!req.headers.has('Content-Type')) {
      headers['Content-Type'] = 'application/vnd.api+json';
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const authReq = req.clone({
      setHeaders: headers,
      withCredentials: true,
    });

    return next(authReq);
  } else {
    return next(req);
  }
};
