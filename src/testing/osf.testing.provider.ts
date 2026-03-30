import { TranslateModule } from '@ngx-translate/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { EnvironmentTokenMock } from './mocks/environment.token.mock';
import { TranslationServiceMock } from './mocks/translation.service.mock';

export function provideOSFCore() {
  return [
    provideNoopAnimations(),
    importProvidersFrom(TranslateModule.forRoot()),
    TranslationServiceMock,
    EnvironmentTokenMock,
  ];
}

export function provideOSFHttp() {
  return [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()];
}
