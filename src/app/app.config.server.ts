import { provideTranslateLoader, TranslateLoader, TranslationObject } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { SSR_CONFIG } from '@core/constants/ssr-config.token';
import { ConfigModel } from '@core/models/config.model';

import { readJsonFile } from '../server/ssr-server-config';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(serverDistFolder, '../browser/assets/config/config.json');
const i18nFolder = resolve(serverDistFolder, '../browser/assets/i18n');
const ssrConfig = {
  ...readJsonFile(configPath, {} as ConfigModel),
  throttleToken: process.env['THROTTLE_TOKEN'] || '',
} as ConfigModel;

const SSR_LANGUAGES = ['en'] as const;
const supportedLanguages = new Set<string>(SSR_LANGUAGES);
const translationCache = new Map<string, TranslationObject>();

translationCache.set(SSR_LANGUAGES[0], readJsonFile(resolve(i18nFolder, `${SSR_LANGUAGES[0]}.json`), {}));

class SsrFsTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    const cached = translationCache.get(lang);

    if (cached) {
      return of(cached);
    }

    if (!supportedLanguages.has(lang)) {
      return of({});
    }

    const translation = readJsonFile(resolve(i18nFolder, `${lang}.json`), {});
    translationCache.set(lang, translation);
    return of(translation);
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideTranslateLoader(SsrFsTranslateLoader),
    { provide: SSR_CONFIG, useValue: ssrConfig },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
