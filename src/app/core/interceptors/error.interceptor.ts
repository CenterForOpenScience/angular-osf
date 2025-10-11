import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { hasViewOnlyParam } from '@osf/shared/helpers';
import { LoaderService, ToastService } from '@osf/shared/services';

import { ERROR_MESSAGES } from '../constants';
import { AuthService } from '../services';

import { BYPASS_ERROR_INTERCEPTOR } from './error-interceptor.tokens';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const loaderService = inject(LoaderService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const sentry = inject(SENTRY_TOKEN);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string;
      if (req.context.get(BYPASS_ERROR_INTERCEPTOR)) {
        sentry.captureException(error);
        return throwError(() => error);
      }

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        if (error.error?.errors?.[0]?.detail) {
          errorMessage = error.error.errors[0].detail;
        } else {
          errorMessage = ERROR_MESSAGES[error.status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
        }
      }

      const serverErrorRegex = /5\d{2}/;

      if (serverErrorRegex.test(error.status.toString())) {
        errorMessage = error.error.message || 'common.errorMessages.serverError';
      }

      if (error.status === 409) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        if (!hasViewOnlyParam(router)) {
          authService.logout();
        }
        return throwError(() => error);
      }

      if (error.status === 403) {
        const requestAccessRegex = /\/v2\/nodes\/[^/]+\/requests\/?$/i;
        if (error.url && requestAccessRegex.test(error.url)) {
          loaderService.hide();
          return throwError(() => error);
        }

        if (error.url?.includes('v2/nodes/')) {
          const match = error.url.match(/\/nodes\/([^/]+)/);
          const id = match ? match[1] : null;

          router.navigate([`/request-access/${id}`]);
        } else {
          router.navigate(['/forbidden']);
        }
      }

      loaderService.hide();

      toastService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};
