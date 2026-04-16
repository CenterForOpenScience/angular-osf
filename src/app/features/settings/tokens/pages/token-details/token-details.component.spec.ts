import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { TokenAddEditFormComponent } from '../../components';
import { TokenModel } from '../../models';
import { DeleteToken, GetTokenById, TokensSelectors } from '../../store';

import { TokenDetailsComponent } from './token-details.component';

describe('TokenDetailsComponent', () => {
  let component: TokenDetailsComponent;
  let fixture: ComponentFixture<TokenDetailsComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let mockToastService: ToastServiceMockType;
  let confirmationService: CustomConfirmationServiceMockType;

  const mockToken: TokenModel = {
    id: 'token-1',
    tokenId: 'token-value-1',
    name: 'Test Token',
    scopes: ['osf.full_read'],
  };

  const defaultSignals: SignalOverride[] = [
    { selector: TokensSelectors.isTokensLoading, value: false },
    {
      selector: TokensSelectors.getTokenById,
      value: (id: string | null) => (id === mockToken.id ? mockToken : null),
    },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    const route = ActivatedRouteMockBuilder.create()
      .withParams(overrides.routeParams ?? { id: 'token-1' })
      .build();
    mockRouter = RouterMockBuilder.create().withUrl('/settings/tokens/token-1').build();
    mockToastService = ToastServiceMock.simple();
    confirmationService = CustomConfirmationServiceMock.simple();
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [
        TokenDetailsComponent,
        ...MockComponents(TokenAddEditFormComponent, IconComponent, LoadingSpinnerComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, mockRouter),
        MockProvider(ToastService, mockToastService),
        MockProvider(CustomConfirmationService, confirmationService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TokenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should set token from selector by route id', () => {
    setup();

    expect(component.tokenId()).toBe('token-1');
    expect(component.token()).toEqual(mockToken);
  });

  it('should dispatch getTokenById on init when token id exists', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetTokenById('token-1'));
  });

  it('should not dispatch getTokenById when token id is missing', () => {
    setup({ routeParams: {} });
    (store.dispatch as Mock).mockClear();

    component.tokenId.set('');
    component.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetTokenById));
  });

  it('should call confirmation service with expected payload on deleteToken', () => {
    setup();

    component.deleteToken();

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'settings.tokens.confirmation.delete.title',
        headerParams: { name: 'Test Token' },
        messageKey: 'settings.tokens.confirmation.delete.message',
        onConfirm: expect.any(Function),
      })
    );
  });

  it('should dispatch delete action and show success flow after confirm', () => {
    setup();

    component.deleteToken();
    const confirmArg = (confirmationService.confirmDelete as Mock).mock.calls[0][0];
    confirmArg.onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteToken('token-1'));
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successDelete');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['settings/tokens']);
  });
});
