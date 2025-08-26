import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

export const translationServiceMock = {
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
