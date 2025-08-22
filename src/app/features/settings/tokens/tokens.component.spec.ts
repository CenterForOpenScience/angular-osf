import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenAddEditFormComponent } from '@osf/features/settings/tokens/components';
import { TokensComponent } from '@osf/features/settings/tokens/tokens.component';
import { SubHeaderComponent } from '@shared/components';
import { IS_SMALL } from '@shared/helpers';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

import { TokensSelectors } from './store';

describe('TokensComponent', () => {
  let component: TokensComponent;
  let fixture: ComponentFixture<TokensComponent>;
  let dialogService: jest.Mocked<DialogService>;

  const mockScopes = [
    { id: 'read', description: 'Read access' },
    { id: 'write', description: 'Write access' },
    { id: 'delete', description: 'Delete access' },
  ];

  const mockTokens = [
    {
      id: '1',
      name: 'Test Token 1',
      tokenId: 'token1',
      scopes: ['read', 'write'],
      ownerId: 'user1',
    },
    {
      id: '2',
      name: 'Test Token 2',
      tokenId: 'token2',
      scopes: ['read'],
      ownerId: 'user1',
    },
  ];

  beforeEach(async () => {
    const mockDialogService = {
      open: jest.fn(),
    };

    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === TokensSelectors.getScopes) return () => mockScopes;
      if (selector === TokensSelectors.isScopesLoading) return () => false;
      if (selector === TokensSelectors.getTokens) return () => mockTokens;
      if (selector === TokensSelectors.isTokensLoading) return () => false;
      if (selector === TokensSelectors.getTokenById) {
        return () => (id: string | null) => mockTokens.find((token) => token.id === id) || null;
      }
      return () => null;
    });

    MOCK_STORE.dispatch.mockImplementation(() => of(undefined));

    await TestBed.configureTestingModule({
      imports: [TokensComponent, MockComponent(SubHeaderComponent)],
      providers: [
        TranslateServiceMock,
        { provide: DialogService, useValue: mockDialogService },
        MockProvider(Store, MOCK_STORE),
        { provide: IS_SMALL, useValue: of(false) },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(DialogService) as jest.Mocked<DialogService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute ngOnInit', () => {
    component.ngOnInit();

    expect(component).toBeTruthy();
  });

  it('should open dialog with correct configuration for large screen', () => {
    component.createToken();

    expect(dialogService.open).toHaveBeenCalledWith(TokenAddEditFormComponent, {
      width: '95vw',
      focusOnShow: false,
      header: 'settings.tokens.form.createTitle',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  });

  it('should open dialog with correct configuration for small screen', async () => {
    const mockDialogService = {
      open: jest.fn(),
    };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TokensComponent, MockComponent(SubHeaderComponent)],
      providers: [
        TranslateServiceMock,
        { provide: DialogService, useValue: mockDialogService },
        MockProvider(Store, MOCK_STORE),
        { provide: IS_SMALL, useValue: of(true) },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(TokensComponent);
    const newComponent = newFixture.componentInstance;
    const newDialogService = TestBed.inject(DialogService) as jest.Mocked<DialogService>;
    newFixture.detectChanges();

    newComponent.createToken();

    expect(newDialogService.open).toHaveBeenCalledWith(TokenAddEditFormComponent, {
      width: '800px ',
      focusOnShow: false,
      header: 'settings.tokens.form.createTitle',
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  });
});
