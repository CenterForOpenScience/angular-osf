import { EnvironmentModel } from '@osf/shared/models/environment.model';

import { existsSync, readFileSync } from 'node:fs';

export type SsrServerEnvironment = Pick<EnvironmentModel, 'apiDomainUrl' | 'webUrl' | 'throttleToken'>;

export const readJsonFile = <T>(path: string, fallback: T): T => {
  if (!existsSync(path)) {
    return fallback;
  }

  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as T;
  } catch {
    return fallback;
  }
};

export const loadSsrServerConfig = (configPath: string): SsrServerEnvironment => {
  const config = readJsonFile(configPath, {} as { apiDomainUrl?: string; webUrl?: string });

  return {
    apiDomainUrl: config.apiDomainUrl || process.env['API_DOMAIN_URL'] || '',
    webUrl: config.webUrl || process.env['WEB_URL'] || '',
    throttleToken: process.env['THROTTLE_TOKEN'] || '',
  };
};
