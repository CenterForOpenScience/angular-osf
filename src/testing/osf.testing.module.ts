import { Store } from '@ngxs/store';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ToastService } from '@osf/shared/services';

@NgModule({
  imports: [NoopAnimationsModule, BrowserModule, CommonModule, TranslateModule.forRoot()],
  providers: [
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    {
      provide: Store,
      useValue: {
        select: jest.fn().mockReturnValue(of([])),
        selectSignal: jest.fn().mockReturnValue(of([])),
        dispatch: jest.fn().mockReturnValue(of({})),
      } as unknown as jest.Mocked<Store>,
    },
    {
      provide: ToastService,
      useValue: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
      },
    },
    {
      provide: TranslateService,
      useValue: {
        get: jest.fn().mockImplementation((key) => of(key || '')),
        instant: jest.fn().mockImplementation((key) => key || ''),
        use: jest.fn(),
        onLangChange: of({}),
      },
    },
  ],
})
export class OSFTestingModule {}
