import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEmailsSelectors } from '@core/store/user-emails';
import { ToastService } from '@osf/shared/services/toast.service';
import { AccountEmailModel } from '@shared/models/emails/account-email.model';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { ConfirmEmailComponent } from './confirm-email.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let mockToastService: ReturnType<ToastServiceMockBuilder['build']>;

  const mockEmail: AccountEmailModel = {
    id: 'email-123',
    emailAddress: 'test@example.com',
    confirmed: false,
    verified: false,
    primary: false,
    isMerge: false,
  };

  beforeEach(async () => {
    jest.useFakeTimers();

    mockToastService = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [ConfirmEmailComponent, OSFTestingModule, MockComponent(LoadingSpinnerComponent)],
      providers: [
        provideMockStore({
          signals: [{ selector: UserEmailsSelectors.isEmailsSubmitting, value: signal(false) }],
        }),
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, {
          data: [mockEmail],
        }),
        MockProvider(ToastService, mockToastService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return email from config data', () => {
    expect(component.email).toEqual(mockEmail);
    expect(component.email.id).toBe('email-123');
    expect(component.email.emailAddress).toBe('test@example.com');
  });

  it('should have isSubmitting signal from store', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('should show success toast with email address', () => {
    component.closeDialog();
    jest.runAllTimers();

    expect(mockToastService.showSuccess).toHaveBeenCalledWith('home.confirmEmail.add.emailNotAdded', {
      name: mockEmail.emailAddress,
    });
  });

  it('should close dialog after successful deletion', () => {
    const mockDialogRef = TestBed.inject(DynamicDialogRef);

    component.closeDialog();
    jest.runAllTimers();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call verifyEmail action without errors', () => {
    expect(() => component.verifyEmail()).not.toThrow();
  });

  it('should show success toast on successful verification', () => {
    component.verifyEmail();
    jest.runAllTimers();

    expect(mockToastService.showSuccess).toHaveBeenCalledWith('home.confirmEmail.add.emailVerified', {
      name: mockEmail.emailAddress,
    });
  });

  it('should close dialog after successful verification', () => {
    const mockDialogRef = TestBed.inject(DynamicDialogRef);

    component.verifyEmail();
    jest.runAllTimers();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog on error without showing success toast', () => {
    const mockDialogRef = TestBed.inject(DynamicDialogRef);

    mockToastService.showSuccess.mockClear();
    (mockDialogRef.close as jest.Mock).mockClear();

    component.verifyEmail();
    jest.runAllTimers();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
