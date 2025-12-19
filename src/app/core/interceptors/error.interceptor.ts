import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { ERROR_MESSAGES } from '@core/constants/error-messages';
import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AuthService } from '@core/services/auth.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { BYPASS_ERROR_INTERCEPTOR } from './error-interceptor.tokens';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const loaderService = inject(LoaderService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const sentry = inject(SENTRY_TOKEN);
  const platformId = inject(PLATFORM_ID);
  const viewOnlyHelper = inject(ViewOnlyLinkHelperService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string;
      if (req.context.get(BYPASS_ERROR_INTERCEPTOR)) {
        sentry.captureException(error);
        return throwError(() => error);
      }

      if (isPlatformBrowser(platformId) && error.error instanceof ErrorEvent) {
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
        if (!viewOnlyHelper.hasViewOnlyParam(router)) {
          if (isPlatformBrowser(platformId)) {
            authService.logout();
          }
        }
        return throwError(() => error);
      }

      if (error.status === 403) {
        const preprintIsUnderModeration = 'This preprint is pending moderation and is not yet publicly available.';
        if (errorMessage === preprintIsUnderModeration) {
          const afterDomain =`/preprints/${document.URL.split('preprints')[1]}`;
          router.navigate([afterDomain + '/pending-moderation']);
        } else {
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
      }

      loaderService.hide();

      toastService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};
