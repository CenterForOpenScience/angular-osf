import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { throwError } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmail, UserEmailsSelectors, VerifyEmail } from '@core/store/user-emails';
import { AccountEmailModel } from '@osf/shared/models/emails/account-email.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { ConfirmEmailComponent } from '@shared/components/confirm-email/confirm-email.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;

  interface SetupOverrides {
    email?: AccountEmailModel;
  }

  function buildEmail(overrides: Partial<AccountEmailModel> = {}): AccountEmailModel {
    return {
      id: 'email-1',
      emailAddress: 'user@example.com',
      confirmed: false,
      verified: false,
      primary: false,
      isMerge: false,
      ...overrides,
    };
  }

  function setup(overrides: SetupOverrides = {}) {
    toastService = ToastServiceMock.simple();
    const email = overrides.email ?? buildEmail();

    TestBed.configureTestingModule({
      imports: [ConfirmEmailComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: [email] }),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [{ selector: UserEmailsSelectors.isEmailsSubmitting, value: false }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose email from dialog config data', () => {
    const email = buildEmail({ id: 'email-2' });
    setup({ email });
    expect(component.email).toEqual(email);
  });

  it('should dispatch delete email and show success for add flow', () => {
    const email = buildEmail({ isMerge: false });
    setup({ email });

    component.closeDialog();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteEmail(email.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith('home.confirmEmail.add.emailNotAdded', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error for delete email failure in add flow', () => {
    const email = buildEmail({ isMerge: false });
    setup({ email });
    (store.dispatch as Mock).mockReturnValueOnce(throwError(() => new Error('delete failed')));

    component.closeDialog();

    expect(toastService.showError).toHaveBeenCalledWith('home.confirmEmail.add.denyError', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should dispatch delete email and show success for merge flow', () => {
    const email = buildEmail({ isMerge: true });
    setup({ email });

    component.closeDialog();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteEmail(email.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith('home.confirmEmail.merge.emailNotAdded', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error for delete email failure in merge flow', () => {
    const email = buildEmail({ isMerge: true });
    setup({ email });
    (store.dispatch as Mock).mockReturnValueOnce(throwError(() => new Error('delete failed')));

    component.closeDialog();

    expect(toastService.showError).toHaveBeenCalledWith('home.confirmEmail.merge.denyError', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should dispatch verify email and show success for add flow', () => {
    const email = buildEmail({ isMerge: false });
    setup({ email });

    component.verifyEmail();

    expect(store.dispatch).toHaveBeenCalledWith(new VerifyEmail(email.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith('home.confirmEmail.add.emailVerified', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error for verify email failure in add flow', () => {
    const email = buildEmail({ isMerge: false });
    setup({ email });
    (store.dispatch as Mock).mockReturnValueOnce(throwError(() => new Error('verify failed')));

    component.verifyEmail();

    expect(toastService.showError).toHaveBeenCalledWith('home.confirmEmail.add.verifyError', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should dispatch verify email and show success for merge flow', () => {
    const email = buildEmail({ isMerge: true });
    setup({ email });

    component.verifyEmail();

    expect(store.dispatch).toHaveBeenCalledWith(new VerifyEmail(email.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith('home.confirmEmail.merge.emailVerified', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error for verify email failure in merge flow', () => {
    const email = buildEmail({ isMerge: true });
    setup({ email });
    (store.dispatch as Mock).mockReturnValueOnce(throwError(() => new Error('verify failed')));

    component.verifyEmail();

    expect(toastService.showError).toHaveBeenCalledWith('home.confirmEmail.merge.verifyError', {
      name: email.emailAddress,
    });
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
