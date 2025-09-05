import { ENVIRONMENT } from '@core/constants/environment.token';

/**
 * Mock provider for Angular's `ENVIRONMENT_INITIALIZER` token used in unit tests.
 *
 * This mock is typically used to bypass environment initialization logic
 * that would otherwise be triggered during Angular app startup.
 *
 * @remarks
 * - Useful in test environments where `provideEnvironmentToken` or other initializers
 *   are registered and might conflict with test setups.
 * - Prevents real environment side-effects during test execution.
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     providers: [EnvironmentTokenMockProvider],
 *   });
 * });
 * ```
 */
export const EnvironmentTokenMock = {
  provide: ENVIRONMENT,
  useValue: {
    production: false,
    google: {
      GOOGLE_FILE_PICKER_API_KEY: 'test-api-key',
      GOOGLE_FILE_PICKER_APP_ID: 'test-app-id',
    },
  },
};
