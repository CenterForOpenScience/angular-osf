import { StateContext } from '@ngxs/store';

import { throwError } from 'rxjs';

export function handleSectionError<T>(ctx: StateContext<T>, section: keyof T, error: Error) {
  ctx.patchState({
    [section]: {
      ...ctx.getState()[section],
      isLoading: false,
      error: error.message,
    },
  } as Partial<T>);
  return throwError(() => error);
}
