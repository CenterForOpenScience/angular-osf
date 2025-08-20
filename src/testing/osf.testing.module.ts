import { Store } from '@ngxs/store';

import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

const storeMock: jest.Mocked<Store> = {
  select: jest.fn().mockReturnValue(of([])),
  selectSignal: jest.fn().mockReturnValue(of([])),
  dispatch: jest.fn().mockReturnValue(of({})),
} as unknown as jest.Mocked<Store>;

@NgModule({
  imports: [NoopAnimationsModule, BrowserModule, CommonModule],
  providers: [
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    { provide: Store, useValue: storeMock },
  ],
})
export class OSFTestingModule {}
