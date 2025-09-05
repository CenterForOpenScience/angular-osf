import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

/**
 * Mock implementation of the TranslationService used for unit testing.
 *
 * This mock provides stubbed implementations for common translation methods, enabling components
 * to be tested without relying on actual i18n infrastructure.
 *
 * Each method is implemented as a Jest mock function, so tests can assert on calls, arguments, and return values.
 *
 * @property get - Simulates retrieval of translated values as an observable.
 * @property instant - Simulates synchronous translation of a key.
 * @property use - Simulates switching the current language.
 * @property stream - Simulates a translation stream for reactive bindings.
 * @property setDefaultLang - Simulates setting the default fallback language.
 * @property getBrowserCultureLang - Simulates detection of the user's browser culture.
 * @property getBrowserLang - Simulates detection of the user's browser language.
 */
export const TranslationServiceMock = {
  provide: TranslateService,
  useValue: {
    get: jest.fn().mockImplementation((key) => of(key || '')),
    instant: jest.fn().mockImplementation((key) => key || ''),
    stream: jest.fn().mockImplementation((key) => of(key || '')),
    use: jest.fn(),
    onLangChange: of({}),
    onTranslationChange: of({
      lang: 'en',
      translations: {},
    }),
    onDefaultLangChange: of({
      lang: 'en',
      translations: {},
    }),
  },
};
