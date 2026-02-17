import { TranslateModule } from '@ngx-translate/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { provideDynamicDialogRefMock } from './mocks/dynamic-dialog-ref.mock';
import { EnvironmentTokenMock } from './mocks/environment.token.mock';
import { ToastServiceMock } from './mocks/toast.service.mock';
import { TranslationServiceMock } from './mocks/translation.service.mock';
import { provideActivatedRouteMock } from './providers/route-provider.mock';
import { provideRouterMock } from './providers/router-provider.mock';

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

export function provideOSFRouting() {
  return [provideRouterMock(), provideActivatedRouteMock()];
}

export function provideOSFDialog() {
  return [provideDynamicDialogRefMock()];
}

export function provideOSFToast() {
  return [ToastServiceMock];
}

export function provideOSFTesting() {
  return [
    ...provideOSFCore(),
    ...provideOSFHttp(),
    ...provideOSFRouting(),
    ...provideOSFDialog(),
    ...provideOSFToast(),
  ];
}
