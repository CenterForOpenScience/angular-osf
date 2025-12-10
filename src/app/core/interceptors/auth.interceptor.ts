import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID, REQUEST } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cookieService = inject(CookieService);
  const platformId = inject(PLATFORM_ID);
  const serverRequest = inject(REQUEST, { optional: true });

  if (req.url.includes('/api.crossref.org/funders')) {
    return next(req);
  }

  const headers: Record<string, string> = {};
  headers['Accept'] = req.responseType === 'text' ? '*/*' : 'application/vnd.api+json;version=2.20';

  if (!req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/vnd.api+json';
  }

  if (isPlatformBrowser(platformId)) {
    const csrfToken = cookieService.get('api-csrf');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const authReq = req.clone({ setHeaders: headers, withCredentials: true });

    return next(authReq);
  }

  if (serverRequest) {
    const cookieHeader = serverRequest.headers.get('cookie') || '';
    if (cookieHeader) {
      if (isPlatformBrowser(platformId)) {
        headers['Cookie'] = cookieHeader;
      }

      const csrfMatch = cookieHeader.match(/api-csrf=([^;]+)/);
      if (csrfMatch) {
        headers['X-CSRFToken'] = csrfMatch[1];
      }
    }
  }

  const authReq = req.clone({ setHeaders: headers });

  return next(authReq);
};
