import { Observable } from 'rxjs';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { environment } from 'src/environments/environment';

export const viewOnlyInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const viewOnlyHelper = inject(ViewOnlyLinkHelperService);

  const viewOnlyParam = viewOnlyHelper.getViewOnlyParam(router);

  if (!req.url.startsWith(environment.funderApiUrl) && viewOnlyParam) {
    if (req.url.includes('view_only=')) {
      return next(req);
    }

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
