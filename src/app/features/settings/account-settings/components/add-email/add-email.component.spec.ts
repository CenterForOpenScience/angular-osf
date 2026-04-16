import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmail, UserEmailsSelectors } from '@core/store/user-emails';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AddEmailComponent } from './add-email.component';

describe('AddEmailComponent', () => {
  let component: AddEmailComponent;
  let fixture: ComponentFixture<AddEmailComponent>;
  let store: Store;
  let toastService: ToastServiceMockType;
  let dialogRef: DynamicDialogRef;
  let isSubmittingSignal: WritableSignal<boolean | undefined>;

  beforeEach(() => {
    toastService = ToastServiceMock.simple();
    isSubmittingSignal = signal(false);

    TestBed.configureTestingModule({
      imports: [AddEmailComponent, MockComponent(TextInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastService),
        provideDynamicDialogRefMock(),
        provideMockStore({
          signals: [{ selector: UserEmailsSelectors.isEmailsSubmitting, value: isSubmittingSignal }],
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(AddEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep email control enabled when not submitting', () => {
    expect(component.emailControl.disabled).toBe(false);
  });

  it('should disable email control when submitting is true', () => {
    isSubmittingSignal.set(true);
    fixture.detectChanges();

    expect(component.emailControl.disabled).toBe(true);
  });

  it('should not dispatch add email when email is invalid', () => {
    (store.dispatch as Mock).mockClear();
    component.emailControl.setValue('invalid-email');

    component.addEmail();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(AddEmail));
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should dispatch add email, close dialog, and show success toast when email is valid', () => {
    (store.dispatch as Mock).mockClear();
    component.emailControl.setValue('user@test.com');

    component.addEmail();

    expect(store.dispatch).toHaveBeenCalledWith(new AddEmail('user@test.com'));
    expect(dialogRef.close).toHaveBeenCalledWith('user@test.com');
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.connectedEmails.successAdd');
  });
});
