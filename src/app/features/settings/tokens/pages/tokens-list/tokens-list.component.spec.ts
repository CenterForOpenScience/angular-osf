import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { DeleteConfirmationOptions } from '@shared/models/confirmation-options.model';

import { MOCK_TOKEN } from '@testing/mocks/token.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { TokenModel } from '../../models';
import { DeleteToken, GetTokens, TokensSelectors } from '../../store';

import { TokensListComponent } from './tokens-list.component';

describe('TokensListComponent', () => {
  let component: TokensListComponent;
  let fixture: ComponentFixture<TokensListComponent>;
  let store: Store;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const defaultSignals: SignalOverride[] = [
    { selector: TokensSelectors.isTokensLoading, value: false },
    { selector: TokensSelectors.getTokens, value: [MOCK_TOKEN] },
  ];

  beforeEach(async () => {
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();
    const signals = mergeSignalOverrides(defaultSignals);

    TestBed.configureTestingModule({
      imports: [TokensListComponent],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TokensListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch get tokens on ngOnInit', () => {
    (store.dispatch as Mock).mockClear();
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new GetTokens());
  });

  it('should call confirmation service with delete payload', () => {
    component.deleteToken(MOCK_TOKEN);

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'settings.tokens.confirmation.delete.title',
        headerParams: { name: MOCK_TOKEN.name },
        messageKey: 'settings.tokens.confirmation.delete.message',
        onConfirm: expect.any(Function),
      })
    );
  });

  it('should dispatch delete action and show success after confirm', () => {
    (store.dispatch as Mock).mockClear();

    component.deleteToken(MOCK_TOKEN);
    const confirmationOptions = (confirmationService.confirmDelete as Mock).mock
      .calls[0][0] as DeleteConfirmationOptions;
    confirmationOptions.onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteToken(MOCK_TOKEN.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successDelete');
  });

  it('should expose tokens from selector', () => {
    expect(component.tokens()).toEqual([MOCK_TOKEN] as TokenModel[]);
  });
});
