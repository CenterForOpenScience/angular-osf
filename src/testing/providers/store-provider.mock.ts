import { Store } from '@ngxs/store';

import { Observable, of } from 'rxjs';

import { isSignal, Signal, signal } from '@angular/core';

/**
 * Interface for a mock NGXS store option configuration.
 */
export interface ProvideMockStoreOptions {
  /**
   * Mocked selector values returned via `select` or `selectSnapshot`.
   */
  selectors?: {
    selector: any;
    value: any;
  }[];

  /**
   * Mocked signal values returned via `selectSignal`.
   */
  signals?: {
    selector: any;
    value: any;
  }[];

  /**
   * Mocked actions to be returned when `dispatch` is called.
   */
  actions?: {
    action: any;
    value: any;
  }[];
}

/**
 * Provides a fully mocked NGXS `Store` for use in Angular unit tests.
 *
 * - Mocks selectors for `select`, `selectSnapshot`, and `selectSignal`.
 * - Allows mapping actions to values for `dispatch` to return.
 * - Enables spies on the dispatch method for assertion purposes.
 *
 * This is intended to work with standalone components and signal-based NGXS usage.
 *
 * @param options - The configuration for selectors, signals, and dispatched action responses.
 * @returns A provider that can be added to the `providers` array in a TestBed configuration.
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     providers: [
 *       provideMockStore({
 *         selectors: [{ selector: MySelector, value: mockValue }],
 *         signals: [{ selector: MySignal, value: signalValue }],
 *         actions: [{ action: new MyAction('id'), value: mockResult }]
 *       })
 *     ]
 *   });
 * });
 * ```
 */
export function provideMockStore(options: ProvideMockStoreOptions = {}): { provide: typeof Store; useValue: Store } {
  /**
   * Stores mock selector values used by `select` and `selectSnapshot`.
   * Keys are selector functions; values are the mocked return values.
   */
  const selectorMap = new Map<any, any>();

  /**
   * Stores mock signal values used by `selectSignal`.
   * Keys are selector functions; values are the mocked signal data.
   */
  const signalMap = new Map<any, any>();

  /**
   * Stores mock action return values used by `dispatch`.
   * Keys are stringified action objects; values are the mocked dispatch responses.
   */
  const actionMap = new Map<any, any>();

  /**
   * Populates the selector map with provided mock selectors.
   * Each selector is mapped to a mock return value used by `select` or `selectSnapshot`.
   */
  (options.selectors || []).forEach(({ selector, value }) => {
    selectorMap.set(selector, value);
  });

  /**
   * Populates the signal map with provided mock signals.
   * Each selector is mapped to a signal-compatible mock value used by `selectSignal`.
   */
  (options.signals || []).forEach(({ selector, value }) => {
    signalMap.set(selector, value);
  });

  /**
   * Populates the action map with mock return values for dispatched actions.
   * Each action is stringified and used as the key for retrieving the mock result.
   */
  (options.actions || []).forEach(({ action, value }) => {
    actionMap.set(JSON.stringify(action), value);
  });

  /**
   * A partial mock implementation of the NGXS Store used for testing.
   *
   * This mock allows for overriding behavior of `select`, `selectSnapshot`,
   * `selectSignal`, and `dispatch`, returning stubbed values provided through
   * `selectorMap`, `signalMap`, and `actionMap`.
   *
   * Designed to be injected via `TestBed.inject(Store)` in unit tests.
   *
   * @type {Partial<Store>}
   */
  const storeMock: Partial<Store> = {
    /**
     * Mock implementation of Store.select().
     * Returns an Observable of the value associated with the given selector.
     * If the selector isn't found, returns `undefined`.
     *
     * @param selector - The selector function or token to retrieve from the store.
     * @returns Observable of the associated value or `undefined`.
     */
    select: (selector: any): Observable<any> => {
      return of(selectorMap.has(selector) ? selectorMap.get(selector) : undefined);
    },

    /**
     * Mock implementation of Store.selectSnapshot().
     * Immediately returns the mock value for the given selector.
     *
     * @param selector - The selector to retrieve the value for.
     * @returns The associated mock value or `undefined` if not found.
     */
    selectSnapshot: (selector: any): any => {
      return selectorMap.get(selector);
    },

    /**
     * Retrieves a signal associated with the given selector.
     *
     * - If the selector already maps to a `Signal<T>`, it is returned as-is.
     * - If the selector maps to a raw value, it is wrapped in a new `Signal<T>`.
     * - This allows both `Signal<T>` and plain values to be stored in the same internal signal map.
     *
     * @template T - The expected type of the signal value.
     * @param selector - The selector used as the key to retrieve the signal or value.
     * @returns {Signal<T>} - A signal wrapping the value or the existing signal.
     *
     * @example
     * // If signalMap has: signalMap.set(MySelector, signal(true))
     * const value = selectSignal(MySelector); // Signal<boolean>
     *
     * @example
     * // If signalMap has: signalMap.set(MySelector, false)
     * const value = selectSignal(MySelector); // Signal<boolean> (wrapped)
     */
    selectSignal: <T>(selector: any): Signal<T> => {
      const value = signalMap.get(selector);

      if (isSignal(value)) {
        return value as Signal<T>;
      }

      return signal(value) as Signal<T>;
    },

    /**
     * Mock implementation of Store.dispatch().
     * Intercepts dispatched actions and returns a mocked observable response.
     * If the action is defined in the `actionMap`, its value is returned.
     * Otherwise, defaults to returning `true` as an Observable.
     *
     * @param action - The action to dispatch.
     * @returns Observable of the associated mock result or `true` by default.
     */
    dispatch: jest.fn((action: any) => {
      const actionKey = JSON.stringify(action);
      return of(actionMap.has(actionKey) ? actionMap.get(actionKey) : true);
    }),
  };

  /**
   * Provides the mocked NGXS Store to Angular's dependency injection system.
   *
   * This object is intended to be used in the `providers` array of
   * `TestBed.configureTestingModule` in unit tests. It overrides the default
   * `Store` service with a custom mock defined in `storeMock`.
   *
   * @returns {Provider} A provider object that maps the `Store` token to the mocked implementation.
   */
  return {
    provide: Store,
    useValue: storeMock as Store,
  };
}
