import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { DynamicDialogRefMock } from './mocks/dynamic-dialog-ref.mock';
import { EnvironmentTokenMock } from './mocks/environment.token.mock';
import { StoreMock } from './mocks/store.mock';
import { ToastServiceMock } from './mocks/toast.service.mock';
import { TranslationServiceMock } from './mocks/translation.service.mock';

/**
 * Shared testing module used across OSF-related unit tests.
 *
 * This module imports and declares no actual components or services. Its purpose is to provide
 * a lightweight Angular module that includes permissive schemas to suppress Angular template
 * validation errors related to unknown elements and attributes.
 *
 * This is useful for testing components that contain custom elements or web components, or when
 * mocking child components not included in the test's declarations or imports.
 */
@NgModule({
  imports: [NoopAnimationsModule, BrowserModule, CommonModule, TranslateModule.forRoot()],
  providers: [
    provideNoopAnimations(),
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    TranslationServiceMock,
    DynamicDialogRefMock,
    EnvironmentTokenMock,
    ToastServiceMock,
  ],
})
export class OSFTestingModule {}

/**
 * Angular testing module that includes the OSFTestingModule and a mock Store provider.
 *
 * This module is intended for unit tests that require NGXS `Store` injection,
 * and it uses `StoreMock` to mock store behavior without requiring a real NGXS store setup.
 *
 * @remarks
 * - Combines permissive schemas (via OSFTestingModule) and store mocking.
 * - Keeps unit tests lightweight and focused by avoiding full store configuration.
 */
@NgModule({
  /**
   * Imports the shared OSF testing module to allow custom elements and suppress schema errors.
   */
  imports: [OSFTestingModule],

  /**
   * Provides a mocked NGXS Store instance for test environments.
   * @see StoreMock - A mock provider simulating Store behaviors like select, dispatch, etc.
   */
  providers: [StoreMock],
})
export class OSFTestingStoreModule {}
