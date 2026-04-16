import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '@core/services/auth.service';
import { PasswordInputHintComponent } from '@osf/shared/components/password-input-hint/password-input-hint.component';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { UpdatePassword } from '../../store';

import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;
  let authService: AuthServiceMockType;

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();
    authService = AuthServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [ChangePasswordComponent, MockComponent(PasswordInputHintComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        MockProvider(AuthService, authService),
        provideMockStore(),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return password mismatch error when confirm password does not match', () => {
    component.passwordForm.setValue({
      oldPassword: 'Oldpass1!',
      newPassword: 'Newpass1!',
      confirmPassword: 'Different1!',
    });

    expect(component.getFormErrors()['passwordMismatch']).toBe(true);
  });

  it('should return sameAsOldPassword error when old and new passwords are equal', () => {
    component.passwordForm.setValue({
      oldPassword: 'Samepass1!',
      newPassword: 'Samepass1!',
      confirmPassword: 'Samepass1!',
    });

    expect(component.getFormErrors()['sameAsOldPassword']).toBe(true);
  });

  it('should mark controls as touched and not dispatch when form is invalid', () => {
    component.passwordForm.setValue({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    vi.mocked(store.dispatch).mockClear();

    component.changePassword();

    expect(component.passwordForm.get('oldPassword')?.touched).toBe(true);
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdatePassword));
    expect(loaderService.show).not.toHaveBeenCalled();
  });

  it('should dispatch update password and handle success flow', () => {
    vi.mocked(store.dispatch).mockClear();
    component.passwordForm.setValue({
      oldPassword: 'Oldpass1!',
      newPassword: 'Newpass1!',
      confirmPassword: 'Newpass1!',
    });

    component.changePassword();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new UpdatePassword('Oldpass1!', 'Newpass1!'));
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.changePassword.messages.success');
    expect(authService.logout).toHaveBeenCalled();
    expect(component.passwordForm.getRawValue()).toEqual({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  });

  it('should show backend error detail when update password fails with detail', () => {
    component.passwordForm.setValue({
      oldPassword: 'Oldpass1!',
      newPassword: 'Newpass1!',
      confirmPassword: 'Newpass1!',
    });
    const httpError = new HttpErrorResponse({
      status: 400,
      error: { errors: [{ detail: 'Current password is incorrect' }] },
    });
    vi.spyOn(store, 'dispatch').mockReturnValue(throwError(() => httpError));

    component.changePassword();

    expect(component.errorMessage()).toBe('Current password is incorrect');
    expect(loaderService.hide).toHaveBeenCalled();
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('should show generic error key when update password fails without detail', () => {
    component.passwordForm.setValue({
      oldPassword: 'Oldpass1!',
      newPassword: 'Newpass1!',
      confirmPassword: 'Newpass1!',
    });
    const httpError = new HttpErrorResponse({
      status: 500,
      error: {},
    });
    vi.spyOn(store, 'dispatch').mockReturnValue(throwError(() => httpError));

    component.changePassword();

    expect(component.errorMessage()).toBe('settings.accountSettings.changePassword.messages.error');
    expect(loaderService.hide).toHaveBeenCalled();
    expect(authService.logout).not.toHaveBeenCalled();
  });
});
