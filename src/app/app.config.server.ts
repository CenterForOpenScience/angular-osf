import { provideTranslateLoader, TranslateLoader } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { SSR_CONFIG } from '@core/constants/ssr-config.token';
import { ConfigModel } from '@core/models/config.model';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

class SsrFsTranslateLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(lang: string): Observable<any> {
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const translationPath = resolve(serverDistFolder, `../browser/assets/i18n/${lang}.json`);

    if (!existsSync(translationPath)) {
      return of({});
    }

    try {
      return of(JSON.parse(readFileSync(translationPath, 'utf-8')));
    } catch {
      return of({});
    }
  }
}

function loadSsrConfig(): ConfigModel {
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const configPath = resolve(serverDistFolder, '../browser/assets/config/config.json');

  let config = {} as ConfigModel;

  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      config = {} as ConfigModel;
    }
  }

  return {
    ...config,
    throttleToken: process.env['THROTTLE_TOKEN'] || '',
  } as ConfigModel;
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideTranslateLoader(SsrFsTranslateLoader),
    { provide: SSR_CONFIG, useFactory: loadSsrConfig },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
