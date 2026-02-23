import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';

import { SSR_CONFIG } from '@core/constants/ssr-config.token';
import { ConfigModel } from '@core/models/config.model';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function loadSsrConfig(): ConfigModel {
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const configPath = resolve(serverDistFolder, '../browser/assets/config/config.json');

  if (existsSync(configPath)) {
    try {
      return JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      return {} as ConfigModel;
    }
  }

  return {} as ConfigModel;
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    { provide: SSR_CONFIG, useFactory: loadSsrConfig },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
