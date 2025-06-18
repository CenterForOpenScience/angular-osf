import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@shared/mocks';

import { EmploymentComponent } from './employment.component';

describe('EmploymentComponent', () => {
  let component: EmploymentComponent;
  let fixture: ComponentFixture<EmploymentComponent>;

  beforeEach(async () => {
    const store = MOCK_STORE;
    store.selectSignal.mockImplementation(() => {
      return signal([]);
    });
    store.dispatch.mockImplementation(() => {
      return of();
    });

    await TestBed.configureTestingModule({
      imports: [EmploymentComponent, MockPipe(TranslatePipe)],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(TranslatePipe),
        MockProvider(Store, store),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
