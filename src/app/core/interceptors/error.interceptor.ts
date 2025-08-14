import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoaderService, ToastService } from '@osf/shared/services';

import { ERROR_MESSAGES } from '../constants';
import { AuthService } from '../services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const loaderService = inject(LoaderService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        if (error.error?.errors?.[0]?.detail) {
          errorMessage = error.error.errors[0].detail;
        } else {
          errorMessage = ERROR_MESSAGES[error.status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
        }
      }

      if (error.status === 401) {
        authService.logout();
        return throwError(() => error);
      }

      if (error.status === 403) {
        if (error.url?.includes('v2/nodes/')) {
          const match = error.url.match(/\/nodes\/([^/]+)/);
          const id = match ? match[1] : null;

          router.navigate([`/request-access/${id}`]);
        } else {
          router.navigate(['/forbidden']);
        }
      }

      loaderService.hide();

      if (error.status === 409) {
        return throwError(() => error);
      }

      toastService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};
