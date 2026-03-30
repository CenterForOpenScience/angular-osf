import { TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  const platformId = inject(PLATFORM_ID);
  const environment = inject(ENVIRONMENT);
  const basePrefix = '/assets/i18n/';
  const webUrl = environment.webUrl?.replace(/\/+$/, '') ?? '';
  const prefix = isPlatformServer(platformId) && webUrl ? `${webUrl}${basePrefix}` : basePrefix;

  return new TranslateHttpLoader(http, prefix, '.json');
}

export const provideTranslation = (): TranslateModuleConfig => ({
  defaultLanguage: 'en',
  loader: {
    provide: TranslateLoader,
    useFactory: httpLoaderFactory,
    deps: [HttpClient],
  },
});
