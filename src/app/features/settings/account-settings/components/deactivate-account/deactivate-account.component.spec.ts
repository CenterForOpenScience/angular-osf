import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, Subject } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { AccountSettingsService } from '@osf/features/settings/account-settings/services';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store';
import { MOCK_STORE } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { CancelDeactivationComponent } from '../cancel-deactivation/cancel-deactivation.component';
import { DeactivationWarningComponent } from '../deactivation-warning/deactivation-warning.component';

import { DeactivateAccountComponent } from './deactivate-account.component';

describe('DeactivateAccountComponent', () => {
  let component: DeactivateAccountComponent;
  let fixture: ComponentFixture<DeactivateAccountComponent>;
  let dialogService: DialogService;
  let translateService: TranslateService;

  const MOCK_ACCOUNT_SETTINGS = {
    twoFactorEnabled: false,
    twoFactorConfirmed: false,
    subscribeOsfGeneralEmail: false,
    subscribeOsfHelpEmail: false,
    deactivationRequested: false,
    contactedDeactivation: false,
    secret: '',
  };

  beforeEach(async () => {
    const store = MOCK_STORE;

    store.selectSignal.mockImplementation((selector) => {
      if (selector === AccountSettingsSelectors.getAccountSettings) {
        return () => MOCK_ACCOUNT_SETTINGS;
      }

      if (selector === AccountSettingsSelectors.getEmails) {
        return () => [];
      }

      if (selector === AccountSettingsSelectors.getRegions) {
        return () => [];
      }

      return () => null;
    });

    store.dispatch.mockImplementation(() => {
      return of();
    });

    await TestBed.configureTestingModule({
      imports: [DeactivateAccountComponent, MockPipe(TranslatePipe)],
      providers: [
        provideNoopAnimations(),
        MockProvider(Store, store),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(DynamicDialogRef, DialogService, TranslateService, ToastService, AccountSettingsService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivateAccountComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(DialogService);
    translateService = TestBed.inject(TranslateService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open DeactivationWarning dialog and on confirm show toast', () => {
    jest.spyOn(translateService, 'instant').mockReturnValue('Deactivate header');

    const onCloseSubject = new Subject<boolean>();
    const dialogRefMock: Partial<DynamicDialogRef> = { onClose: onCloseSubject };
    const openSpy = jest.spyOn(dialogService, 'open').mockReturnValue(dialogRefMock as DynamicDialogRef);

    component.deactivateAccount();

    expect(openSpy).toHaveBeenCalledWith(
      DeactivationWarningComponent,
      expect.objectContaining({
        width: '552px',
        header: 'Deactivate header',
        modal: true,
      })
    );

    onCloseSubject.next(true);
  });

  it('should open CancelDeactivation dialog and on confirm dispatch action', () => {
    jest.spyOn(translateService, 'instant').mockReturnValue('Cancel header');

    const onCloseSubject = new Subject<boolean>();
    const dialogRefMock: Partial<DynamicDialogRef> = { onClose: onCloseSubject };
    const openSpy = jest.spyOn(dialogService, 'open').mockReturnValue(dialogRefMock as DynamicDialogRef);

    component.cancelDeactivation();

    expect(openSpy).toHaveBeenCalledWith(
      CancelDeactivationComponent,
      expect.objectContaining({
        width: '552px',
        header: 'Cancel header',
        modal: true,
      })
    );

    onCloseSubject.next(true);
  });
});
