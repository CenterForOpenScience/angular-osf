import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { of, throwError } from 'rxjs';

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputHintComponent } from '@osf/shared/components/password-input-hint/password-input-hint.component';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { AccountSettingsState } from '../../store';

import { ChangePasswordComponent } from './change-password.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent, MockComponent(PasswordInputHintComponent), MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslateServiceMock,
        MockProvider(LoaderService),
        MockProvider(ToastService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change password  when form is valid', () => {
    component.passwordForm.setValue({
      oldPassword: 'Oldpass1!',
      newPassword: 'Newpass1!',
      confirmPassword: 'Newpass1!',
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());
    component.changePassword();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should display error message when backend returns error', () => {
    component.passwordForm.setValue({
      oldPassword: 'Oldpass1!',
      newPassword: 'Newpass1!',
      confirmPassword: 'Newpass1!',
    });
    const errorDetail = 'Current password is incorrect';
    const httpError = new HttpErrorResponse({
      status: 400,
      error: { errors: [{ detail: errorDetail }] },
    });
    jest.spyOn(store, 'dispatch').mockReturnValue(throwError(() => httpError));
    component.changePassword();
    expect(component['errorMessage']()).toBe(errorDetail);
  });
});
