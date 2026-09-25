import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock, Mocked } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationNames } from '@osf/shared/enums/operation-names.enum';
import { OperationInvocationRequestJsonApi } from '@osf/shared/models/addons/addon-operations-json-api.model';
import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';
import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';
import { AddonsSelectors, CreateAddonOperationInvocation } from '@osf/shared/stores/addons';

import { MOCK_ADDON } from '@testing/mocks/addon.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { AddonOperationInvocationServiceMockFactory } from '@testing/providers/addon-operation-invocation.service.mock';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { ConfirmAccountConnectionModalComponent } from './confirm-account-connection-modal.component';

describe('ConfirmAccountConnectionModalComponent', () => {
  let component: ConfirmAccountConnectionModalComponent;
  let fixture: ComponentFixture<ConfirmAccountConnectionModalComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let operationInvocationService: Mocked<AddonOperationInvocationService>;

  const selectedAccount: AuthorizedAccountModel = {
    ...MOCK_ADDON,
    id: 'account-1',
    displayName: 'Google Drive',
    type: 'authorized-storage-accounts',
    authUrl: null,
    authorizedCapabilities: ['ACCESS'],
    authorizedOperationNames: [OperationNames.LIST_ROOT_ITEMS],
    credentialsAvailable: true,
    apiBaseUrl: 'https://www.googleapis.com',
    defaultRootFolder: '',
    oauthToken: 'token',
    accountOwnerId: 'owner-1',
    externalStorageServiceId: 'service-1',
  };

  const invocationPayload = {
    data: {
      type: 'addon-operation-invocations',
      attributes: {
        invocation_status: null,
        operation_name: OperationNames.LIST_ROOT_ITEMS,
        operation_kwargs: {},
        operation_result: {},
        created: null,
        modified: null,
      },
      relationships: {},
    },
  } as OperationInvocationRequestJsonApi;

  const defaultSignals: SignalOverride[] = [
    { selector: AddonsSelectors.getOperationInvocationSubmitting, value: false },
  ];

  interface SetupOverrides extends BaseSetupOverrides {
    message?: string;
    omitMessage?: boolean;
    selectedAccount?: AuthorizedAccountModel | null;
    isGoogleDrive?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    const account = overrides.selectedAccount === undefined ? selectedAccount : overrides.selectedAccount;
    const data = {
      ...(overrides.omitMessage ? {} : { message: overrides.message ?? 'Connect this account?' }),
      selectedAccount: account,
      isGoogleDrive: overrides.isGoogleDrive ?? false,
    };
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    operationInvocationService = AddonOperationInvocationServiceMockFactory();
    operationInvocationService.createInitialOperationInvocationPayload.mockReturnValue(invocationPayload);

    TestBed.configureTestingModule({
      imports: [ConfirmAccountConnectionModalComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data }),
        MockProvider(AddonOperationInvocationService, operationInvocationService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(ConfirmAccountConnectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should read the message from dialog config', () => {
    setup();

    expect(component.dialogMessage).toBe('Connect this account?');
  });

  it('should use an empty message when dialog data omits it', () => {
    setup({ omitMessage: true });

    expect(component.dialogMessage).toBe('');
  });

  it('should expose the submitting state from the store', () => {
    setup({
      selectorOverrides: [{ selector: AddonsSelectors.getOperationInvocationSubmitting, value: true }],
    });

    expect(component.isSubmitting()).toBe(true);
  });

  it('should render the confirmation message', () => {
    setup();

    expect(fixture.nativeElement.textContent).toContain('Connect this account?');
  });

  it('should disable cancel while the connection is submitting', () => {
    setup({
      selectorOverrides: [{ selector: AddonsSelectors.getOperationInvocationSubmitting, value: true }],
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(true);
  });

  it('should not connect when the selected account is missing', () => {
    setup({ selectedAccount: null });
    (store.dispatch as Mock).mockClear();

    component.handleConnectAddonAccount();

    expect(operationInvocationService.createInitialOperationInvocationPayload).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close with success for Google Drive without creating an invocation', () => {
    setup({ isGoogleDrive: true });
    (store.dispatch as Mock).mockClear();

    component.handleConnectAddonAccount();

    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });
    expect(operationInvocationService.createInitialOperationInvocationPayload).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should create a root-items invocation and close with success', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.handleConnectAddonAccount();

    expect(operationInvocationService.createInitialOperationInvocationPayload).toHaveBeenCalledWith(
      OperationNames.LIST_ROOT_ITEMS,
      selectedAccount
    );
    expect(store.dispatch).toHaveBeenCalledWith(new CreateAddonOperationInvocation(invocationPayload));
    expect(dialogRef.close).toHaveBeenCalledWith({ success: true });
  });

  it('should close without a result when cancel is clicked', () => {
    setup();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
