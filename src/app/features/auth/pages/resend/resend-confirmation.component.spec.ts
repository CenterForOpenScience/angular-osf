import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '@core/services/auth.service';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';

import { ResendConfirmationComponent } from './resend-confirmation.component';

describe('ResendConfirmationComponent', () => {
  let component: ResendConfirmationComponent;
  let fixture: ComponentFixture<ResendConfirmationComponent>;
  let authService: AuthServiceMockType;

  beforeEach(() => {
    authService = AuthServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [ResendConfirmationComponent, MockComponent(TextInputComponent)],
      providers: [provideOSFCore(), MockProvider(AuthService, authService)],
    });

    fixture = TestBed.createComponent(ResendConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call resendConfirmationUrl when form is invalid', () => {
    component.resendConfirmationForm.setValue({ email: '' });

    component.onSubmit();

    expect(authService.resendConfirmationUrl).not.toHaveBeenCalled();
    expect(component.message()).toBeNull();
  });

  it('should not call resendConfirmationUrl when email is not a valid email address', () => {
    component.resendConfirmationForm.setValue({ email: 'not-an-email' });

    component.onSubmit();

    expect(authService.resendConfirmationUrl).not.toHaveBeenCalled();
    expect(component.message()).toBeNull();
  });

  it('should call resendConfirmationUrl, reset the form, and set the success message when form is valid', () => {
    component.resendConfirmationForm.setValue({ email: 'user@example.com' });

    component.onSubmit();

    expect(authService.resendConfirmationUrl).toHaveBeenCalledWith('user@example.com');
    expect(component.resendConfirmationForm.getRawValue()).toEqual({ email: null });
    expect(component.message()).toEqual({
      severity: 'success',
      content: 'auth.resendConfirmation.messages.success',
    });
  });

  it('should clear the message on onCloseMessage', () => {
    component.resendConfirmationForm.setValue({ email: 'user@example.com' });
    component.onSubmit();
    expect(component.message()).not.toBeNull();

    component.onCloseMessage();

    expect(component.message()).toBeNull();
  });
});
