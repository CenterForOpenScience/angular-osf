import { InjectionToken } from '@angular/core';

import * as Sentry from '@sentry/angular';

/**
 * Injection token used to provide the Sentry module via Angular's dependency injection system.
 *
 * This token represents the entire Sentry module (`@sentry/angular`), allowing you to inject
 * and use Sentry APIs (e.g., `captureException`, `init`, `setUser`, etc.) in Angular services
 * or components.
 *
 * @example
 * ```ts
 * const Sentry = inject(SENTRY_TOKEN);
 * Sentry.captureException(new Error('Something went wrong'));
 * ```
 */
export const SENTRY_TOKEN = new InjectionToken<typeof Sentry>('Sentry');

/**
 * Angular provider that binds the `SENTRY_TOKEN` to the actual `@sentry/angular` module.
 *
 * Use this provider in your module or application configuration to make Sentry injectable.
 *
 * @example
 * ```ts
 * providers: [
 *   SENTRY_PROVIDER,
 * ]
 * ```
 *
 *  Inject the Sentry module via the factory token
 * private readonly Sentry = inject(SENTRY_TOKEN);
 *
 *  throwError(): void {
 *    try {
 *      throw new Error('Test error for Sentry capture');
 *    } catch (error) {
 *      Send the error to Sentry
 *      this.Sentry.captureException(error);
 *    }
 *  }
 *
 * @see SENTRY_TOKEN
 */
export const SENTRY_PROVIDER = {
  provide: SENTRY_TOKEN,
  useValue: Sentry,
};
