import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TokenCreatedDialogComponent } from '@osf/features/settings/tokens/components';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';

import { TokenFormControls, TokenModel } from '../../models';
import { TokensSelectors } from '../../store';

import { TokenAddEditFormComponent } from './token-add-edit-form.component';

describe('TokenAddEditFormComponent', () => {
  let component: TokenAddEditFormComponent;
  let fixture: ComponentFixture<TokenAddEditFormComponent>;
  let dialogService: Partial<DialogService>;
  let dialogRef: Partial<DynamicDialogRef>;
  let activatedRoute: Partial<ActivatedRoute>;
  let router: Partial<Router>;
  let toastService: Partial<ToastService>;

  const MOCK_TOKEN: TokenModel = {
    id: '1',
    name: 'Test Token',
    tokenId: 'token1',
    scopes: ['read', 'write'],
    ownerId: 'user1',
  };

  const MOCK_SCOPES = [
    { id: 'read', description: 'Read access' },
    { id: 'write', description: 'Write access' },
    { id: 'delete', description: 'Delete access' },
  ];

  const MOCK_TOKENS = [MOCK_TOKEN];

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === TokensSelectors.getScopes) return () => MOCK_SCOPES;
      if (selector === TokensSelectors.isTokensLoading) return () => false;
      if (selector === TokensSelectors.getTokens) return () => MOCK_TOKENS;
      if (selector === TokensSelectors.getTokenById) {
        return () => (id: string) => MOCK_TOKENS.find((token) => token.id === id);
      }
      return () => null;
    });

    dialogService = {
      open: jest.fn(),
    };

    dialogRef = {
      close: jest.fn(),
    };

    activatedRoute = {
      params: of({ id: MOCK_TOKEN.id }),
    };

    router = {
      navigate: jest.fn(),
    };

    toastService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TokenAddEditFormComponent, MockPipe(TranslatePipe), ReactiveFormsModule],
      providers: [
        TranslateServiceMock,
        MockProvider(Store, MOCK_STORE),
        MockProvider(DialogService, dialogService),
        MockProvider(DynamicDialogRef, dialogRef),
        MockProvider(ActivatedRoute, activatedRoute),
        MockProvider(Router, router),
        MockProvider(ToastService, toastService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenAddEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form with initial values when provided', () => {
    fixture.componentRef.setInput('initialValues', MOCK_TOKEN);
    component.ngOnInit();

    expect(component.tokenForm.get(TokenFormControls.TokenName)?.value).toBe(MOCK_TOKEN.name);
    expect(component.tokenForm.get(TokenFormControls.Scopes)?.value).toEqual(MOCK_TOKEN.scopes);
  });

  it('should not submit when form is invalid', () => {
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: '',
      [TokenFormControls.Scopes]: [],
    });

    const markAllAsTouchedSpy = jest.spyOn(component.tokenForm, 'markAllAsTouched');
    const markAsDirtySpy = jest.spyOn(component.tokenForm.get(TokenFormControls.TokenName)!, 'markAsDirty');

    component.handleSubmitForm();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(markAsDirtySpy).toHaveBeenCalled();
    expect(MOCK_STORE.dispatch).not.toHaveBeenCalled();
  });

  it('should return early when tokenName is missing', () => {
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: '',
      [TokenFormControls.Scopes]: ['read'],
    });

    component.handleSubmitForm();

    expect(MOCK_STORE.dispatch).not.toHaveBeenCalled();
  });

  it('should return early when scopes is missing', () => {
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Test Token',
      [TokenFormControls.Scopes]: [],
    });

    component.handleSubmitForm();

    expect(MOCK_STORE.dispatch).not.toHaveBeenCalled();
  });

  it('should create token when not in edit mode', () => {
    fixture.componentRef.setInput('isEditMode', false);
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Test Token',
      [TokenFormControls.Scopes]: ['read', 'write'],
    });

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(MOCK_STORE.dispatch).toHaveBeenCalled();
  });

  it('should update token when in edit mode', () => {
    fixture.componentRef.setInput('isEditMode', true);
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Updated Token',
      [TokenFormControls.Scopes]: ['read', 'write', 'delete'],
    });

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(MOCK_STORE.dispatch).toHaveBeenCalled();
  });

  it('should show success toast and close dialog after creating token', () => {
    fixture.componentRef.setInput('isEditMode', false);
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Test Token',
      [TokenFormControls.Scopes]: ['read', 'write'],
    });

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successCreate');
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show success toast and navigate after updating token', () => {
    fixture.componentRef.setInput('isEditMode', true);
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Updated Token',
      [TokenFormControls.Scopes]: ['read', 'write'],
    });

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successEdit');
    expect(router.navigate).toHaveBeenCalledWith(['settings/tokens']);
  });

  it('should show token created dialog with new token data after successful creation', () => {
    fixture.componentRef.setInput('isEditMode', false);
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Test Token',
      [TokenFormControls.Scopes]: ['read', 'write'],
    });

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(dialogService.open).toHaveBeenCalledWith(
      TokenCreatedDialogComponent,
      expect.objectContaining({
        width: '500px',
        header: 'settings.tokens.createdDialog.title',
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: {
          tokenName: MOCK_TOKEN.name,
          tokenValue: MOCK_TOKEN.tokenId,
        },
      })
    );
  });

  it('should open dialog with correct configuration', () => {
    const tokenName = 'Test Token';
    const tokenValue = 'test-token-value';

    component.showTokenCreatedDialog(tokenName, tokenValue);

    expect(dialogService.open).toHaveBeenCalledWith(
      TokenCreatedDialogComponent,
      expect.objectContaining({
        width: '500px',
        header: 'settings.tokens.createdDialog.title',
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: {
          tokenName,
          tokenValue,
        },
      })
    );
  });

  it('should require token name', () => {
    const tokenNameControl = component.tokenForm.get(TokenFormControls.TokenName);
    expect(tokenNameControl?.hasError('required')).toBe(true);
  });

  it('should require scopes', () => {
    const scopesControl = component.tokenForm.get(TokenFormControls.Scopes);
    expect(scopesControl?.hasError('required')).toBe(true);
  });

  it('should be valid when both fields are filled', () => {
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: 'Test Token',
      [TokenFormControls.Scopes]: ['read'],
    });

    expect(component.tokenForm.valid).toBe(true);
  });

  it('should have correct input limits for token name', () => {
    expect(component.inputLimits).toBeDefined();
  });
});
