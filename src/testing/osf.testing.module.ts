import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { EnvironmentTokenMock } from './mocks/environment.token.mock';
import { StoreMock } from './mocks/store.mock';
import { ToastServiceMock } from './mocks/toast.service.mock';
import { TranslationServiceMock } from './mocks/translation.service.mock';

@NgModule({
  imports: [NoopAnimationsModule, BrowserModule, CommonModule, TranslateModule.forRoot()],
  providers: [
    provideNoopAnimations(),
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    TranslationServiceMock,
    EnvironmentTokenMock,
  ],
})
export class OSFTestingModule {}

@NgModule({
  imports: [OSFTestingModule],
  providers: [StoreMock, ToastServiceMock],
})
export class OSFTestingStoreModule {}
