import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { provideTranslation } from '@core/helpers/i18n.helper';

import { EnvironmentTokenMock } from './providers/environment.token.mock';
import { TranslateServiceMock } from './providers/translate.service.mock';

export function provideOSFCore() {
  return [provideTranslation, TranslateServiceMock, EnvironmentTokenMock];
}

export function provideOSFHttp() {
  return [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()];
}
