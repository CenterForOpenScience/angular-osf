import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AccountSettings } from '../../models';
import { AccountSettingsSelectors, DisableTwoFactorAuth, EnableTwoFactorAuth, VerifyTwoFactorAuth } from '../../store';

import { TwoFactorAuthComponent } from './two-factor-auth.component';

import { QRCodeComponent } from 'angularx-qrcode';

describe('TwoFactorAuthComponent', () => {
  let component: TwoFactorAuthComponent;
  let fixture: ComponentFixture<TwoFactorAuthComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const accountSettings: AccountSettings = {
    twoFactorEnabled: true,
    twoFactorConfirmed: false,
    subscribeOsfGeneralEmail: true,
    subscribeOsfHelpEmail: true,
    deactivationRequested: false,
    contactedDeactivation: false,
    secret: 'SECRET123',
  };

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [TwoFactorAuthComponent, MockComponent(QRCodeComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [
            { selector: AccountSettingsSelectors.getAccountSettings, value: accountSettings },
            { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TwoFactorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute qr code link from current user and account settings', () => {
    expect(component.qrCodeLink()).toBe(`otpauth://totp/OSF:${MOCK_USER.id}?secret=${accountSettings.secret}`);
  });

  it('should open configure confirmation and enable two factor on confirm', () => {
    (store.dispatch as Mock).mockClear();

    component.configureTwoFactorAuth();

    expect(confirmationService.confirmAccept).toHaveBeenCalledWith({
      headerKey: 'settings.accountSettings.twoFactorAuth.configure.title',
      messageKey: 'settings.accountSettings.twoFactorAuth.configure.description',
      acceptLabelKey: 'settings.accountSettings.common.buttons.configure',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationService.confirmAccept.mock.calls[0][0];
    onConfirm();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new EnableTwoFactorAuth());
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should open disable confirmation and call disable method on confirm', () => {
    const disableSpy = vi.spyOn(component, 'disableTwoFactor');

    component.openDisableDialog();

    expect(confirmationService.confirmAccept).toHaveBeenCalledWith({
      headerKey: 'settings.accountSettings.twoFactorAuth.disable.title',
      messageKey: 'settings.accountSettings.twoFactorAuth.disable.message',
      acceptLabelKey: 'settings.accountSettings.common.buttons.disable',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationService.confirmAccept.mock.calls[0][0];
    onConfirm();

    expect(disableSpy).toHaveBeenCalled();
  });

  it('should not verify two factor when verification code is empty', () => {
    (store.dispatch as Mock).mockClear();
    component.verificationCode.setValue(null);

    component.enableTwoFactor();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(VerifyTwoFactorAuth));
  });

  it('should verify two factor and show success toast when code is provided', () => {
    (store.dispatch as Mock).mockClear();
    component.verificationCode.setValue('123456');

    component.enableTwoFactor();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new VerifyTwoFactorAuth('123456'));
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'settings.accountSettings.twoFactorAuth.verification.success'
    );
  });

  it('should disable two factor and show success toast', () => {
    (store.dispatch as Mock).mockClear();

    component.disableTwoFactor();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DisableTwoFactorAuth());
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.twoFactorAuth.successDisable');
  });
});
