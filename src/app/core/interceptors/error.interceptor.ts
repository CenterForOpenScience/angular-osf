import { Store } from '@ngxs/store';

import { catchError, throwError } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID, RESPONSE_INIT } from '@angular/core';
import { Router } from '@angular/router';

import { ERROR_MESSAGES } from '@core/constants/error-messages';
import { PREPRINT_PENDING_MODERATION_DETAIL } from '@core/constants/http-error-details.const';
import {
  isServerError,
  setSsrResponseStatus,
  shouldPropagateHttpStatusToSsr,
} from '@core/helpers/ssr-response-status.helper';
import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AuthService } from '@core/services/auth.service';
import { MaintenanceModeService } from '@core/services/maintenance-mode.service';
import { UserSelectors } from '@core/store/user';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { BYPASS_ERROR_INTERCEPTOR } from './error-interceptor.tokens';

const NO_AUTH_REDIRECT_HEADER = 'X-No-Auth-Redirect';
const REQUEST_ACCESS_URL_REGEX = /\/v2\/nodes\/[^/]+\/requests\/?$/i;
const NODE_ID_URL_REGEX = /\/v2\/nodes\/([^/]+)/;
const DRAFT_REGISTRY_ROUTE_REGEX = /\/registries\/drafts\/.+/i;

const isSilentForbidden = (req: HttpRequest<unknown>, error: HttpErrorResponse): boolean =>
  req.headers.has(NO_AUTH_REDIRECT_HEADER) || (!!error.url && REQUEST_ACCESS_URL_REGEX.test(error.url));

const isPendingModerationForbidden = (error: HttpErrorResponse): boolean =>
  error.error?.errors?.[0]?.detail === PREPRINT_PENDING_MODERATION_DETAIL;

const getErrorMessage = (error: HttpErrorResponse): string => {
  if (error.error instanceof ErrorEvent) {
    return error.error.message;
  }

  if (error.error?.errors?.[0]?.detail) {
    return error.error.errors[0].detail;
  }

  if (isServerError(error.status)) {
    return error.error?.message || ERROR_MESSAGES[500];
  }

  return ERROR_MESSAGES[error.status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const loaderService = inject(LoaderService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const maintenanceModeService = inject(MaintenanceModeService);
  const sentry = inject(SENTRY_TOKEN);
  const viewOnlyHelper = inject(ViewOnlyLinkHelperService);
  const store = inject(Store);
  const responseInit = inject(RESPONSE_INIT, { optional: true });
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  const handleUnauthorized = () => {
    if (viewOnlyHelper.hasViewOnlyParam(router)) {
      return;
    }

    if (store.selectSnapshot(UserSelectors.isAuthenticated)) {
      authService.logout(window.location.href);
    } else {
      authService.navigateToSignIn();
    }
  };

  const handleForbidden = (url: string | null) => {
    const nodeId = url?.match(NODE_ID_URL_REGEX)?.[1];

    if (!nodeId) {
      router.navigate(['/forbidden']);
    } else if (!DRAFT_REGISTRY_ROUTE_REGEX.test(router.url)) {
      router.navigate(['/request-access', nodeId]);
    }
  };

  const applySsrStatus = (error: HttpErrorResponse) => {
    if (
      req.context.get(BYPASS_ERROR_INTERCEPTOR) ||
      !shouldPropagateHttpStatusToSsr(error.status) ||
      isSilentForbidden(req, error)
    ) {
      return;
    }

    setSsrResponseStatus(responseInit, error.status);
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const rethrow = () => throwError(() => error);

      if (!isBrowser) {
        applySsrStatus(error);
        return rethrow();
      }

      if (req.context.get(BYPASS_ERROR_INTERCEPTOR)) {
        sentry.captureException(error);
        return rethrow();
      }

      if (maintenanceModeService.isMaintenanceError(error)) {
        loaderService.hide();
        maintenanceModeService.activate();
        return rethrow();
      }

      switch (error.status) {
        case 401:
          handleUnauthorized();
          break;
        case 403:
          if (!isSilentForbidden(req, error) && !isPendingModerationForbidden(error)) {
            handleForbidden(error.url);
          }
          break;
        case 404:
          router.navigate(['/not-found']);
          break;
        case 409:
          return rethrow();
        case 410:
          router.navigate(['/content-deleted']);
          break;
        default:
          toastService.showError(getErrorMessage(error));
          break;
      }

      loaderService.hide();
      return rethrow();
    })
  );
};
