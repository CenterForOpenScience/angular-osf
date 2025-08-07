import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ResetPasswordComponent } from '@osf/features/auth/pages';
import { AuthState } from '@osf/features/auth/store';
import { PasswordInputHintComponent } from '@osf/shared/components';
import { TranslateServiceMock } from '@osf/shared/mocks';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        MockComponent(PasswordInputHintComponent),
        MockPipe(TranslatePipe, (value) => value),
      ],
      providers: [
        TranslateServiceMock,
        MockProvider(ActivatedRoute, { queryParams: of({}) }),
        provideStore([AuthState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
