import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { UserState } from '@osf/core/store/user';
import { MockCustomConfirmationServiceProvider } from '@shared/mocks';
import { CustomConfirmationService } from '@shared/services';

import { AccountSettingsState } from '../../store';

import { TwoFactorAuthComponent } from './two-factor-auth.component';

describe('TwoFactorAuthComponent', () => {
  let component: TwoFactorAuthComponent;
  let fixture: ComponentFixture<TwoFactorAuthComponent>;
  let store: Store;
  let customConfirmationService: CustomConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFactorAuthComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([UserState, AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(TranslateService, DialogService, MessageService),
        MockCustomConfirmationServiceProvider,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoFactorAuthComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    customConfirmationService = TestBed.inject(CustomConfirmationService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call enableTwoFactorAuth when confirmation accepted', () => {
    jest.spyOn(customConfirmationService, 'confirmAccept').mockImplementation(({ onConfirm }) => {
      onConfirm();
    });
    jest.spyOn(store, 'dispatch').mockReturnValue(of());

    component.configureTwoFactorAuth();

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should call disableTwoFactor when confirmation accepted', () => {
    jest.spyOn(customConfirmationService, 'confirmAccept').mockImplementation(({ onConfirm }) => {
      onConfirm();
    });
    jest.spyOn(component, 'disableTwoFactor');

    component.openDisableDialog();

    expect(component.disableTwoFactor).toHaveBeenCalled();
  });

  it('should not call verifyTwoFactorAuth if verificationCode is null', () => {
    component.verificationCode.setValue(null);

    jest.spyOn(store, 'dispatch').mockReturnValue(of());

    component.enableTwoFactor();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should call disableTwoFactorAuth when disableTwoFactor is called', fakeAsync(() => {
    jest.spyOn(store, 'dispatch').mockReturnValue(of());

    component.disableTwoFactor();

    expect(store.dispatch).toHaveBeenCalled();
  }));
});
