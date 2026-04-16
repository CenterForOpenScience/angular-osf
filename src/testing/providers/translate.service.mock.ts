import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

export const TranslateServiceMock = {
  provide: TranslateService,
  useValue: {
    onTranslationChange: of({ lang: 'en', translations: {} }),
    onLangChange: of({ lang: 'en', translations: {} }),
    onFallbackLangChange: of({ lang: 'en', translations: {} }),
    onDefaultLangChange: of({ lang: 'en', translations: {} }),

    get: vi.fn().mockImplementation((key: string | string[]) => of(key)),
    instant: vi.fn().mockImplementation((key: string | string[]) => key),
    stream: vi.fn().mockImplementation((key: string | string[]) => of(key)),
    getStreamOnTranslationChange: vi.fn().mockImplementation((key: string | string[]) => of(key)),

    use: vi.fn().mockReturnValue(of({})),
    setFallbackLang: vi.fn().mockReturnValue(of({})),
    setDefaultLang: vi.fn().mockReturnValue(of({})),
    reloadLang: vi.fn().mockReturnValue(of({})),
    getParsedResult: vi.fn().mockImplementation((key) => key),

    getLangs: vi.fn().mockReturnValue(['en']),
    getCurrentLang: vi.fn().mockReturnValue('en'),
    getFallbackLang: vi.fn().mockReturnValue('en'),
    getDefaultLang: vi.fn().mockReturnValue('en'),
    getBrowserLang: vi.fn().mockReturnValue('en'),
    getBrowserCultureLang: vi.fn().mockReturnValue('en-US'),

    currentLang: 'en',
    defaultLang: 'en',
    langs: ['en'],

    addLangs: vi.fn(),
    resetLang: vi.fn(),
    set: vi.fn(),
    setTranslation: vi.fn(),
  },
};
