import { StateContext } from '@ngxs/store';

import { throwError } from 'rxjs';

import * as Sentry from '@sentry/angular';

export function handleSectionError<T>(ctx: StateContext<T>, section: keyof T, error: Error) {
  // Report error to Sentry
  Sentry.captureException(error);

  // Patch the state to update loading/submitting flags and set the error message
  ctx.patchState({
    [section]: {
      ...ctx.getState()[section],
      isLoading: false,
      isSubmitting: false,
      error: error.message,
    },
  } as Partial<T>);
  // Rethrow the error as an observable
  return throwError(() => error);
}
