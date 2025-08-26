import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const viewOnlyInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  const currentUrl = router.url;
  const urlParams = new URLSearchParams(currentUrl.split('?')[1] || '');
  const viewOnlyParam = urlParams.get('view_only');

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
