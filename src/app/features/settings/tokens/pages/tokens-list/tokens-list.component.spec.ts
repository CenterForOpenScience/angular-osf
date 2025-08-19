import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink } from '@angular/router';

import { CustomConfirmationService, ToastService } from '@osf/shared/services';

import { TokenModel } from '../../models';

import { TokensListComponent } from './tokens-list.component';

jest.mock('@core/store/user', () => ({}));
jest.mock('@osf/shared/stores/collections', () => ({}));
jest.mock('@osf/shared/stores/addons', () => ({}));
jest.mock('@osf/features/settings/tokens/store', () => ({}));

const mockGetTokens = jest.fn();
const mockDeleteToken = jest.fn(() => of(void 0));

jest.mock('@ngxs/store', () => {
  return {
    createDispatchMap: jest.fn(() => ({
      getTokens: mockGetTokens,
      deleteToken: mockDeleteToken,
    })),
    select: (selectorFn: any) => {
      const name = selectorFn?.name;
      if (name === 'isTokensLoading') return of(false);
      if (name === 'getTokens') return of([]);
      return of(undefined);
    },
  };
});

describe('TokensListComponent', () => {
  let component: TokensListComponent;
  let fixture: ComponentFixture<TokensListComponent>;

  const mockConfirmationService = {
    confirmDelete: jest.fn(),
  };

  const mockToastService = {
    showSuccess: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokensListComponent, TranslatePipe, Button, Card, Skeleton, RouterLink],
      providers: [
        { provide: CustomConfirmationService, useValue: mockConfirmationService },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getTokens on init', () => {
    expect(mockGetTokens).toHaveBeenCalled();
  });

  it('should call confirmDelete and deleteToken, then showSuccess', () => {
    const token: TokenModel = { id: 'abc123', name: 'My Token' } as TokenModel;

    mockConfirmationService.confirmDelete.mockImplementation((config: any) => {
      config.onConfirm();
    });

    component.deleteToken(token);

    expect(mockConfirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'settings.tokens.confirmation.delete.title',
        messageKey: 'settings.tokens.confirmation.delete.message',
        headerParams: { name: token.name },
        onConfirm: expect.any(Function),
      })
    );

    expect(mockDeleteToken).toHaveBeenCalledWith(token.id);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('settings.tokens.toastMessage.successDelete');
  });
});
