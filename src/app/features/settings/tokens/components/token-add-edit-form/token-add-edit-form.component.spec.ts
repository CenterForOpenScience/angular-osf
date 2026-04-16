import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ScopeModel, TokenFormControls, TokenModel } from '../../models';
import { CreateToken, TokensSelectors, UpdateToken } from '../../store';
import { TokenCreatedDialogComponent } from '../token-created-dialog/token-created-dialog.component';

import { TokenAddEditFormComponent } from './token-add-edit-form.component';

interface SetupOverrides extends BaseSetupOverrides {
  isEditMode?: boolean;
  initialValues?: TokenModel | null;
}

describe('TokenAddEditFormComponent', () => {
  let component: TokenAddEditFormComponent;
  let fixture: ComponentFixture<TokenAddEditFormComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let mockToastService: ToastServiceMockType;
  let mockCustomDialogService: CustomDialogServiceMockType;
  let dialogRef: DynamicDialogRef;

  const tokenFromState: TokenModel = {
    id: 'token-1',
    tokenId: 'secret-token-value',
    name: 'Created Token',
    scopes: ['osf.full_read'],
  };

  const defaultSignals: SignalOverride[] = [
    {
      selector: TokensSelectors.getScopes,
      value: [{ id: 'osf.full_read', description: 'Read access' }] as ScopeModel[],
    },
    { selector: TokensSelectors.isTokensLoading, value: false },
    { selector: TokensSelectors.getTokens, value: [tokenFromState] as TokenModel[] },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const route = ActivatedRouteMockBuilder.create()
      .withParams({ id: overrides.routeParams?.['id'] ?? 'token-1' })
      .build();
    mockRouter = RouterMockBuilder.create().withUrl('/settings/tokens/token-1').build();
    mockToastService = ToastServiceMock.simple();
    mockCustomDialogService = CustomDialogServiceMock.simple();

    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [TokenAddEditFormComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, route),
        MockProvider(Router, mockRouter),
        MockProvider(ToastService, mockToastService),
        MockProvider(CustomDialogService, mockCustomDialogService),
        provideDynamicDialogRefMock(),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TokenAddEditFormComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);

    if (overrides.isEditMode !== undefined) {
      fixture.componentRef.setInput('isEditMode', overrides.isEditMode);
    }
    if (overrides.initialValues !== undefined) {
      fixture.componentRef.setInput('initialValues', overrides.initialValues);
    }

    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should patch form with initial values on init', () => {
    const initialValues: TokenModel = {
      id: 'token-2',
      tokenId: 'token-value-2',
      name: 'Existing Token',
      scopes: ['osf.full_write'],
    };
    setup({ initialValues });

    expect(component.tokenForm.get(TokenFormControls.TokenName)?.value).toBe('Existing Token');
    expect(component.tokenForm.get(TokenFormControls.Scopes)?.value).toEqual(['osf.full_write']);
  });

  it('should disable form when loading is true', () => {
    setup({
      selectorOverrides: [{ selector: TokensSelectors.isTokensLoading, value: true }],
    });

    expect(component.tokenForm.disabled).toBe(true);
  });

  it('should mark controls as touched and dirty when submitting invalid form', () => {
    setup();

    component.handleSubmitForm();

    expect(component.tokenForm.invalid).toBe(true);
    expect(component.tokenForm.get(TokenFormControls.TokenName)?.touched).toBe(true);
    expect(component.tokenForm.get(TokenFormControls.TokenName)?.dirty).toBe(true);
    expect(component.tokenForm.get(TokenFormControls.Scopes)?.touched).toBe(true);
    expect(component.tokenForm.get(TokenFormControls.Scopes)?.dirty).toBe(true);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should create token and open created dialog when submitting valid form in create mode', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'New API Token',
      [TokenFormControls.Scopes]: ['osf.full_read'],
    });

    component.handleSubmitForm();

    expect(store.dispatch).toHaveBeenCalledWith(new CreateToken('New API Token', ['osf.full_read']));
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successCreate');
    expect(dialogRef.close).toHaveBeenCalledWith();
    expect(mockCustomDialogService.open).toHaveBeenCalledWith(
      TokenCreatedDialogComponent,
      expect.objectContaining({
        header: 'settings.tokens.createdDialog.title',
        width: '500px',
        data: {
          tokenName: 'Created Token',
          tokenValue: 'secret-token-value',
        },
      })
    );
  });

  it('should update token and navigate when submitting valid form in edit mode', () => {
    setup({ isEditMode: true, routeParams: { id: 'token-9' } });
    (store.dispatch as Mock).mockClear();

    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Updated Token',
      [TokenFormControls.Scopes]: ['osf.full_read'],
    });

    component.handleSubmitForm();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateToken('token-9', 'Updated Token', ['osf.full_read']));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['settings/tokens']);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successEdit');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should open created-token dialog with provided values', () => {
    setup();

    component.showTokenCreatedDialog('Dialog Token', 'dialog-token-value');

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(
      TokenCreatedDialogComponent,
      expect.objectContaining({
        header: 'settings.tokens.createdDialog.title',
        width: '500px',
        data: {
          tokenName: 'Dialog Token',
          tokenValue: 'dialog-token-value',
        },
      })
    );
  });
});
