import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { PasswordInputHintComponent } from '@osf/shared/components/password-input-hint/password-input-hint.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(() => {
    const mockRoute = ActivatedRouteMockBuilder.create().withQueryParams({}) as Partial<ActivatedRoute>;

    TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, MockComponent(PasswordInputHintComponent)],
      providers: [provideOSFCore(), MockProvider(AuthService), MockProvider(ActivatedRoute, mockRoute)],
    });

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
