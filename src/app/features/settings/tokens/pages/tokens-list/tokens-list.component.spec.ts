import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { Confirmation, ConfirmationService } from 'primeng/api';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TokenModel } from '../../models';
import { DeleteToken } from '../../store';

import { TokensListComponent } from './tokens-list.component';

describe('TokensListComponent', () => {
  let component: TokensListComponent;
  let fixture: ComponentFixture<TokensListComponent>;
  let store: Partial<Store>;
  let confirmationService: Partial<ConfirmationService>;

  const mockTokens: TokenModel[] = [
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
    store = {
      dispatch: jest.fn().mockReturnValue(of(undefined)),
      selectSignal: jest.fn().mockReturnValue(signal(mockTokens)),
    };

    confirmationService = {
      confirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TokensListComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(TranslateService),
        MockProvider(Store, store),
        MockProvider(ConfirmationService, confirmationService),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load tokens on init if they already exist', () => {
    component.ngOnInit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should display tokens in the list', () => {
    const tokenElements = fixture.debugElement.queryAll(By.css('p-card'));
    expect(tokenElements.length).toBe(mockTokens.length);
  });

  it('should show token names in the list', () => {
    const tokenNames = fixture.debugElement.queryAll(By.css('h2'));
    expect(tokenNames[0].nativeElement.textContent).toBe(mockTokens[0].name);
    expect(tokenNames[1].nativeElement.textContent).toBe(mockTokens[1].name);
  });

  it('should show confirmation dialog when deleting token', () => {
    const token = mockTokens[0];
    component.deleteToken(token);
    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should dispatch delete action when confirmation is accepted', () => {
    const token = mockTokens[0];
    (confirmationService.confirm as jest.Mock).mockImplementation((config: Confirmation) => {
      if (config.accept) {
        config.accept();
      }
      return confirmationService;
    });
    component.deleteToken(token);
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteToken(token.id));
  });

  it('should not dispatch delete action when confirmation is rejected', () => {
    const token = mockTokens[0];
    (confirmationService.confirm as jest.Mock).mockImplementation((config: Confirmation) => {
      if (config.reject) {
        config.reject();
      }
      return confirmationService;
    });
    component.deleteToken(token);
    expect(store.dispatch).not.toHaveBeenCalledWith(new DeleteToken(token.id));
  });
});
