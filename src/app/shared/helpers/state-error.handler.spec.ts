import { StateContext } from '@ngxs/store';

import { firstValueFrom } from 'rxjs';

import { handleSectionError } from './state-error.handler'; // adjust path as needed

import * as Sentry from '@sentry/angular';

jest.mock('@sentry/angular');

describe('Helper: State Error Handler', () => {
  interface TestState {
    mySection: {
      isLoading: boolean;
      isSubmitting: boolean;
      error?: string;
      otherField?: string;
    };
  }

  it('should patch the state and throw the error', async () => {
    const patchState = jest.fn();
    const ctx: StateContext<TestState> = {
      getState: () => ({
        mySection: {
          isLoading: true,
          isSubmitting: true,
          otherField: 'someValue',
        },
      }),
      patchState,
      setState: jest.fn(),
      dispatch: jest.fn(),
    };

    const error = new Error('Something went wrong');

    const result$ = handleSectionError(ctx, 'mySection', error);

    expect(patchState).toHaveBeenCalledWith({
      mySection: {
        isLoading: false,
        isSubmitting: false,
        error: 'Something went wrong',
        otherField: 'someValue',
      },
    });

    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      tags: { feature: 'state error section: mySection', 'state.section': 'mySection' },
    });
    await expect(firstValueFrom(result$)).rejects.toThrow('Something went wrong');
  });
});
