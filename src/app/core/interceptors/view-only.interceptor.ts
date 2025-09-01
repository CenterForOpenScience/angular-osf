import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { getViewOnlyParam } from '@osf/shared/helpers';

export const viewOnlyInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  const viewOnlyParam = getViewOnlyParam(router);

  if (!req.url.includes('/api.crossref.org/funders') && viewOnlyParam) {
    const separator = req.url.includes('?') ? '&' : '?';
    const updatedUrl = `${req.url}${separator}view_only=${encodeURIComponent(viewOnlyParam)}`;

    const viewOnlyReq = req.clone({
      url: updatedUrl,
    });

    return next(viewOnlyReq);
  } else {
    return next(req);
  }
};
