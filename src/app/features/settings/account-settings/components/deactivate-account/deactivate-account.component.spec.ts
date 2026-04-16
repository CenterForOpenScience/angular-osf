import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AccountSettingsSelectors, CancelDeactivationRequest, DeactivateAccount } from '../../store';
import { CancelDeactivationComponent } from '../cancel-deactivation/cancel-deactivation.component';
import { DeactivationWarningComponent } from '../deactivation-warning/deactivation-warning.component';

import { DeactivateAccountComponent } from './deactivate-account.component';

describe('DeactivateAccountComponent', () => {
  let component: DeactivateAccountComponent;
  let fixture: ComponentFixture<DeactivateAccountComponent>;
  let store: Store;
  let customDialogService: CustomDialogServiceMockType;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;
  let dialogRef: DynamicDialogRef;

  const defaultSignals: SignalOverride[] = [
    {
      selector: AccountSettingsSelectors.getAccountSettings,
      value: {
        twoFactorEnabled: false,
        twoFactorConfirmed: false,
        subscribeOsfGeneralEmail: true,
        subscribeOsfHelpEmail: true,
        deactivationRequested: false,
        contactedDeactivation: false,
        secret: '',
      },
    },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    customDialogService = CustomDialogServiceMock.simple();
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [DeactivateAccountComponent],
      providers: [
        provideOSFCore(),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        provideDynamicDialogRefMock(),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    customDialogService.open.mockReturnValue(dialogRef);
    fixture = TestBed.createComponent(DeactivateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should open deactivation warning dialog', () => {
    setup();

    component.deactivateAccount();

    expect(customDialogService.open).toHaveBeenCalledWith(DeactivationWarningComponent, {
      header: 'settings.accountSettings.deactivateAccount.dialog.deactivate.title',
      width: '552px',
    });
  });

  it('should not dispatch deactivate action when dialog closes with false', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.deactivateAccount();
    (dialogRef.onClose as Subject<boolean>).next(false);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DeactivateAccount));
    expect(loaderService.show).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should dispatch deactivate action and show success when dialog closes with true', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.deactivateAccount();
    (dialogRef.onClose as Subject<boolean>).next(true);

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DeactivateAccount());
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'settings.accountSettings.deactivateAccount.successDeactivation'
    );
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should open cancel deactivation dialog', () => {
    setup();

    component.cancelDeactivation();

    expect(customDialogService.open).toHaveBeenCalledWith(CancelDeactivationComponent, {
      header: 'settings.accountSettings.deactivateAccount.dialog.undo.title',
      width: '552px',
    });
  });

  it('should not dispatch cancel action when dialog closes with false', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.cancelDeactivation();
    (dialogRef.onClose as Subject<boolean>).next(false);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CancelDeactivationRequest));
    expect(loaderService.show).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should dispatch cancel action and show success when dialog closes with true', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.cancelDeactivation();
    (dialogRef.onClose as Subject<boolean>).next(true);

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new CancelDeactivationRequest());
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'settings.accountSettings.deactivateAccount.successCancelDeactivation'
    );
    expect(loaderService.hide).toHaveBeenCalled();
  });
});
