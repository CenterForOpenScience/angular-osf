import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, Subject } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DestroyRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmailsState } from '@core/store/user-emails';
import { SetCurrentUser, UserState } from '@osf/core/store/user';
import { AddEmailComponent, ConfirmationSentDialogComponent } from '@osf/features/settings/account-settings/components';
import { MOCK_USER, MockCustomConfirmationServiceProvider } from '@shared/mocks';
import { CustomConfirmationService, LoaderService, ToastService } from '@shared/services';

import { AccountSettingsState } from '../../store';

import { ConnectedEmailsComponent } from './connected-emails.component';

describe('ConnectedEmailsComponent', () => {
  let component: ConnectedEmailsComponent;
  let fixture: ComponentFixture<ConnectedEmailsComponent>;
  let customConfirmationService: CustomConfirmationService;
  let dialogService: DialogService;
  let translateService: TranslateService;
  let store: Store;

  const mockEmail = {
    id: 'id1',
    emailAddress: 'email@gmail.com',
    confirmed: false,
    verified: false,
    primary: false,
    isMerge: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedEmailsComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState, UserState, UserEmailsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(DialogService, TranslateService, DestroyRef, LoaderService, ToastService),
        MockCustomConfirmationServiceProvider,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedEmailsComponent);
    customConfirmationService = TestBed.inject(CustomConfirmationService);
    translateService = TestBed.inject(TranslateService);
    dialogService = TestBed.inject(DialogService);
    customConfirmationService = TestBed.inject(CustomConfirmationService);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open AddEmail dialog and on close call confirmation dialog', () => {
    jest.spyOn(translateService, 'instant').mockReturnValue('Dialog Header');

    const onCloseSubject = new Subject<string>();
    const dialogRefMock: Partial<DynamicDialogRef> = {
      onClose: onCloseSubject,
    };
    const openSpy = jest.spyOn(dialogService, 'open').mockReturnValue(dialogRefMock as DynamicDialogRef);

    const confirmationSpy = jest.spyOn(component, 'showConfirmationSentDialog').mockImplementation(() => {
      // Simulate dialog opening and closing
    });

    component.addEmail();

    expect(openSpy).toHaveBeenCalledWith(
      AddEmailComponent,
      expect.objectContaining({
        width: '448px',
        header: 'Dialog Header',
        modal: true,
      })
    );

    onCloseSubject.next(mockEmail.emailAddress);

    expect(confirmationSpy).toHaveBeenCalledWith(mockEmail.emailAddress);
  });

  it('should open ConfirmationSentDialog with email data', () => {
    jest.spyOn(translateService, 'instant').mockReturnValue('Header');

    const dialogRefMock: Partial<DynamicDialogRef> = {
      onClose: new Subject<void>(),
    };

    const openSpy = jest.spyOn(dialogService, 'open').mockReturnValue(dialogRefMock as DynamicDialogRef);

    component.showConfirmationSentDialog(mockEmail.emailAddress);

    expect(openSpy).toHaveBeenCalledWith(
      ConfirmationSentDialogComponent,
      expect.objectContaining({
        width: '448px',
        header: 'Header',
        modal: true,
        data: mockEmail.emailAddress,
      })
    );
  });

  it('should call deleteEmails when confirmation is accepted', () => {
    const deleteSpy = jest.spyOn(component, 'deleteEmails').mockImplementation(() => {
      // Simulate successful email deletion
    });

    jest.spyOn(customConfirmationService, 'confirmDelete').mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    component.openConfirmDeleteEmail(mockEmail);

    expect(customConfirmationService.confirmDelete).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(mockEmail.id);
  });

  it('should resend confirmation when accepted', () => {
    store.dispatch(new SetCurrentUser(MOCK_USER));
    jest.spyOn(customConfirmationService, 'confirmAccept').mockImplementation(({ onConfirm }) => onConfirm());

    jest.spyOn(store, 'dispatch').mockReturnValue(of());

    component.resendConfirmation(mockEmail);

    expect(customConfirmationService.confirmAccept).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should delete email', () => {
    const emailId = mockEmail.id;
    jest.spyOn(store, 'dispatch').mockReturnValue(of());

    component.deleteEmails(emailId);

    expect(store.dispatch).toHaveBeenCalled();
  });
});
