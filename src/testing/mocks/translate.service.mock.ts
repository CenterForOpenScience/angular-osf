import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

export const TranslateServiceMock = {
  provide: TranslateService,
  useValue: {
    get: jest.fn().mockImplementation((key: string) => of(key)),
    instant: jest.fn().mockImplementation((key: string) => key),
    onLangChange: of({ lang: 'en' }),
    onTranslationChange: of({ translations: {} }),
    onDefaultLangChange: of({ lang: 'en' }),
    setDefaultLang: jest.fn(),
    use: jest.fn(),
    getDefaultLang: jest.fn().mockReturnValue('en'),
    getBrowserLang: jest.fn().mockReturnValue('en'),
    addLangs: jest.fn(),
    getLangs: jest.fn().mockReturnValue(['en']),
    stream: jest.fn().mockImplementation((key: string) => of(key)),
    currentLang: 'en',
    defaultLang: 'en',
  },
};
