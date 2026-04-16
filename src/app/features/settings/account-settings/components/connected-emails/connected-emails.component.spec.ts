import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, Subject } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmail, GetEmails, MakePrimary, ResendConfirmation, UserEmailsSelectors } from '@core/store/user-emails';
import { UserSelectors } from '@osf/core/store/user';
import { ReadonlyInputComponent } from '@osf/shared/components/readonly-input/readonly-input.component';
import { IS_SMALL } from '@osf/shared/helpers/breakpoints.tokens';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AccountEmail } from '../../models';
import { AddEmailComponent } from '../add-email/add-email.component';
import { ConfirmationSentDialogComponent } from '../confirmation-sent-dialog/confirmation-sent-dialog.component';

import { ConnectedEmailsComponent } from './connected-emails.component';

describe('ConnectedEmailsComponent', () => {
  let component: ConnectedEmailsComponent;
  let fixture: ComponentFixture<ConnectedEmailsComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let confirmationService: CustomConfirmationServiceMockType;
  let customDialogService: CustomDialogServiceMockType;
  let toastService: ToastServiceMockType;

  const primaryEmail: AccountEmail = {
    id: '1',
    emailAddress: 'primary@test.com',
    confirmed: true,
    verified: true,
    primary: true,
    isMerge: false,
  };
  const confirmedEmail: AccountEmail = {
    id: '2',
    emailAddress: 'confirmed@test.com',
    confirmed: true,
    verified: true,
    primary: false,
    isMerge: false,
  };
  const unconfirmedEmail: AccountEmail = {
    id: '3',
    emailAddress: 'unconfirmed@test.com',
    confirmed: false,
    verified: false,
    primary: false,
    isMerge: false,
  };

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    confirmationService = CustomConfirmationServiceMock.simple();
    customDialogService = CustomDialogServiceMock.simple();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [ConnectedEmailsComponent, MockComponent(ReadonlyInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(IS_SMALL, of(false)),
        MockProvider(LoaderService, loaderService),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
            { selector: UserEmailsSelectors.getEmails, value: [primaryEmail, confirmedEmail, unconfirmedEmail] },
            { selector: UserEmailsSelectors.isEmailsLoading, value: false },
            { selector: UserEmailsSelectors.isEmailsSubmitting, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ConnectedEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should split emails into primary, confirmed, and unconfirmed groups', () => {
    expect(component.primaryEmail()).toEqual(primaryEmail);
    expect(component.confirmedEmails()).toEqual([confirmedEmail]);
    expect(component.unconfirmedEmails()).toEqual([unconfirmedEmail]);
  });

  it('should open add email dialog and show confirmation dialog when dialog returns email', () => {
    const onClose = new Subject<string>();
    customDialogService.open.mockReturnValue({
      onClose,
    } as unknown as DynamicDialogRef);
    const showConfirmationSpy = vi.spyOn(component, 'showConfirmationSentDialog');

    component.addEmail();
    onClose.next('new@test.com');

    expect(customDialogService.open).toHaveBeenCalledWith(AddEmailComponent, {
      header: 'settings.accountSettings.connectedEmails.dialog.title',
      width: '448px',
    });
    expect(showConfirmationSpy).toHaveBeenCalledWith('new@test.com');
  });

  it('should open confirmation sent dialog with expected payload', () => {
    component.showConfirmationSentDialog('email@test.com');

    expect(customDialogService.open).toHaveBeenCalledWith(ConfirmationSentDialogComponent, {
      header: 'settings.accountSettings.connectedEmails.confirmationSentDialog.header',
      width: '448px',
      data: 'email@test.com',
    });
  });

  it('should resend confirmation and refresh emails on confirm', () => {
    (store.dispatch as Mock).mockClear();
    component.resendConfirmation(unconfirmedEmail);

    expect(confirmationService.confirmAccept).toHaveBeenCalled();
    const { onConfirm } = confirmationService.confirmAccept.mock.calls[0][0];
    onConfirm();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new ResendConfirmation(unconfirmedEmail.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.connectedEmails.successResend');
    expect(store.dispatch).toHaveBeenCalledWith(new GetEmails());
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should make email primary on confirm', () => {
    (store.dispatch as Mock).mockClear();
    component.makePrimary(confirmedEmail);

    expect(confirmationService.confirmAccept).toHaveBeenCalled();
    const { onConfirm } = confirmationService.confirmAccept.mock.calls[0][0];
    onConfirm();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new MakePrimary(confirmedEmail.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'settings.accountSettings.connectedEmails.successMakePrimary'
    );
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should open delete confirmation and delete email on confirm', () => {
    const deleteSpy = vi.spyOn(component, 'deleteEmails');

    component.openConfirmDeleteEmail(confirmedEmail);

    expect(confirmationService.confirmDelete).toHaveBeenCalled();
    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(deleteSpy).toHaveBeenCalledWith(confirmedEmail.id);
  });

  it('should delete email and show success toast', () => {
    (store.dispatch as Mock).mockClear();

    component.deleteEmails(confirmedEmail.id);

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteEmail(confirmedEmail.id));
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.connectedEmails.successDelete');
  });
});
