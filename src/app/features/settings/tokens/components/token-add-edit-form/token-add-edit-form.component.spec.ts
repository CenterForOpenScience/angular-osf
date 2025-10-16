import { Store } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TokenCreatedDialogComponent } from '@osf/features/settings/tokens/components';
import { InputLimits } from '@osf/shared/constants';
import { ToastService } from '@shared/services';

import { TokenFormControls, TokenModel } from '../../models';
import { CreateToken, TokensSelectors } from '../../store';

import { TokenAddEditFormComponent } from './token-add-edit-form.component';

import { MOCK_SCOPES, MOCK_STORE, MOCK_TOKEN, TranslateServiceMock } from '@testing/mocks';
import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('TokenAddEditFormComponent', () => {
  let component: TokenAddEditFormComponent;
  let fixture: ComponentFixture<TokenAddEditFormComponent>;
  let dialogService: Partial<DialogService>;
  let dialogRef: Partial<DynamicDialogRef>;
  let activatedRoute: Partial<ActivatedRoute>;
  let router: Partial<Router>;
  let toastService: jest.Mocked<ToastService>;
  let translateService: jest.Mocked<TranslateService>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;

  const mockTokens: TokenModel[] = [MOCK_TOKEN];

  const fillForm = (tokenName: string = MOCK_TOKEN.name, scopes: string[] = MOCK_TOKEN.scopes): void => {
    component.tokenForm.patchValue({
      [TokenFormControls.TokenName]: tokenName,
      [TokenFormControls.Scopes]: scopes,
    });
  };

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === TokensSelectors.getScopes) return () => MOCK_SCOPES;
      if (selector === TokensSelectors.isTokensLoading) return () => false;
      if (selector === TokensSelectors.getTokens) return () => mockTokens;
      if (selector === TokensSelectors.getTokenById) {
        return () => (id: string) => mockTokens.find((token) => token.id === id);
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

    toastServiceMock = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [TokenAddEditFormComponent, ReactiveFormsModule, OSFTestingStoreModule],
      providers: [
        TranslateServiceMock,
        MockProvider(Store, MOCK_STORE),
        MockProvider(DialogService, dialogService),
        MockProvider(DynamicDialogRef, dialogRef),
        MockProvider(ActivatedRoute, activatedRoute),
        MockProvider(Router, router),
        MockProvider(ToastService, toastServiceMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenAddEditFormComponent);
    component = fixture.componentInstance;

    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    translateService = TestBed.inject(TranslateService) as jest.Mocked<TranslateService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form with initial values on init', () => {
    fixture.componentRef.setInput('initialValues', MOCK_TOKEN);
    const patchSpy = jest.spyOn(component.tokenForm, 'patchValue');

    component.ngOnInit();

    expect(patchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        [TokenFormControls.TokenName]: MOCK_TOKEN.name,
        [TokenFormControls.Scopes]: MOCK_TOKEN.scopes,
      })
    );
    expect(component.tokenForm.get(TokenFormControls.TokenName)?.value).toBe(MOCK_TOKEN.name);
    expect(component.tokenForm.get(TokenFormControls.Scopes)?.value).toEqual(MOCK_TOKEN.scopes);
  });

  it('should not patch form when initialValues are not provided', () => {
    fixture.componentRef.setInput('initialValues', null);

    fillForm('Existing Name', ['read']);

    component.ngOnInit();

    expect(component.tokenForm.get(TokenFormControls.TokenName)?.value).toBe('Existing Name');
    expect(component.tokenForm.get(TokenFormControls.Scopes)?.value).toEqual(['read']);
  });

  it('should not submit when form is invalid', () => {
    fillForm('', []);

    const markAllAsTouchedSpy = jest.spyOn(component.tokenForm, 'markAllAsTouched');
    const markAsDirtySpy = jest.spyOn(component.tokenForm.get(TokenFormControls.TokenName)!, 'markAsDirty');
    const markScopesAsDirtySpy = jest.spyOn(component.tokenForm.get(TokenFormControls.Scopes)!, 'markAsDirty');

    component.handleSubmitForm();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(markAsDirtySpy).toHaveBeenCalled();
    expect(markScopesAsDirtySpy).toHaveBeenCalled();
    expect(MOCK_STORE.dispatch).not.toHaveBeenCalled();
  });

  it('should return early when tokenName is missing', () => {
    fillForm('', ['read']);

    component.handleSubmitForm();

    expect(MOCK_STORE.dispatch).not.toHaveBeenCalled();
  });

  it('should return early when scopes is missing', () => {
    fillForm('Test Token', []);

    component.handleSubmitForm();

    expect(MOCK_STORE.dispatch).not.toHaveBeenCalled();
  });

  it('should create token when not in edit mode', () => {
    fixture.componentRef.setInput('isEditMode', false);
    fillForm('Test Token', ['read', 'write']);

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(MOCK_STORE.dispatch).toHaveBeenCalledWith(new CreateToken('Test Token', ['read', 'write']));
  });

  it('should show success toast and close dialog after creating token', () => {
    fixture.componentRef.setInput('isEditMode', false);
    fillForm('Test Token', ['read', 'write']);

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successCreate');
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show success toast and navigate after updating token', () => {
    fixture.componentRef.setInput('isEditMode', true);
    fillForm('Updated Token', ['read', 'write']);

    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successEdit');
    expect(router.navigate).toHaveBeenCalledWith(['settings/tokens']);
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

  it('should use TranslateService.instant for dialog header', () => {
    component.showTokenCreatedDialog('Name', 'Value');
    expect(translateService.instant).toHaveBeenCalledWith('settings.tokens.createdDialog.title');
  });

  it('should read tokens via selectSignal after create', () => {
    fixture.componentRef.setInput('isEditMode', false);
    fillForm('Test Token', ['read']);

    const selectSpy = jest.spyOn(MOCK_STORE, 'selectSignal');
    MOCK_STORE.dispatch.mockReturnValue(of(undefined));

    component.handleSubmitForm();

    expect(selectSpy).toHaveBeenCalledWith(TokensSelectors.getTokens);
  });

  it('should expose the same inputLimits as InputLimits.fullName', () => {
    expect(component.inputLimits).toBe(InputLimits.fullName);
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
    fillForm('Test Token', ['read']);

    expect(component.tokenForm.valid).toBe(true);
  });

  it('should have correct input limits for token name', () => {
    expect(component.inputLimits).toBeDefined();
  });

  it('should expose tokenId from route params', () => {
    expect(component.tokenId()).toBe(MOCK_TOKEN.id);
  });

  it('should expose scopes from store via tokenScopes signal', () => {
    expect(component.tokenScopes()).toEqual(MOCK_SCOPES);
  });
});
