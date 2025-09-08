import { Store } from '@ngxs/store';

import { of } from 'rxjs';

/**
 * A simple Jest-based mock for the Angular NGXS `Store`.
 *
 * @remarks
 * This mock provides a no-op implementation of the `dispatch` method and an empty `select` observable.
 * Useful when the store is injected but no store behavior is required for the test.
 *
 * @example
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: Store, useValue: storeMock }
 *   ]
 * });
 * ```
 *
 * @property dispatch - A Jest mock function that returns an observable of `true` when called.
 * @property select - A function returning an observable emitting `undefined`, acting as a placeholder selector.
 */
export const StoreMock = {
  provide: Store,
  useValue: {
    select: jest.fn().mockReturnValue(of([])),
    selectSignal: jest.fn().mockReturnValue(of([])),
    dispatch: jest.fn().mockReturnValue(of({})),
  } as unknown as jest.Mocked<Store>,
};
