import { StateContext } from '@ngxs/store';

import { throwError } from 'rxjs';

import * as Sentry from '@sentry/angular';

export function handleSectionError<T>(ctx: StateContext<T>, section: keyof T, error: Error) {
  Sentry.captureException(error, {
    tags: {
      'state.section': section.toString(),
      feature: `state error section: ${section.toString()}`,
    },
  });

  ctx.patchState({
    [section]: {
      ...ctx.getState()[section],
      isLoading: false,
      isSubmitting: false,
      error: error.message,
    },
  } as Partial<T>);

  return throwError(() => error);
}
