import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { CookieService } from '../services/cookie.service';

import { environment } from 'src/environments/environment';

export const cookieAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.cookieAuth.enabled) {
    return next(req);
  }

  const cookieService = inject(CookieService);
  const csrfToken = cookieService.getCsrfToken();

  const isOsfApiRequest = req.url.includes(environment.apiDomainUrl) || req.url.includes('localhost:8000');

  if (isOsfApiRequest) {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.api+json; version=2.20',
      'Content-Type': 'application/vnd.api+json',
    };

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const authReq = req.clone({
      setHeaders: headers,
      withCredentials: true,
    });

    return next(authReq);
  }

  return next(req);
};
