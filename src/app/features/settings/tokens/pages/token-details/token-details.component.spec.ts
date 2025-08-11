import { Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { ConfirmationService, MessageService } from 'primeng/api';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, RouterModule } from '@angular/router';

import { ToastService } from '@shared/services';

import { TokenModel } from '../../models';

import { TokenDetailsComponent } from './token-details.component';

describe.only('TokenDetailsComponent', () => {
  let component: TokenDetailsComponent;
  let fixture: ComponentFixture<TokenDetailsComponent>;
  let store: Partial<Store>;
  let confirmationService: Partial<ConfirmationService>;

  const mockToken: TokenModel = {
    id: '1',
    name: 'Test Token',
    tokenId: 'token1',
    scopes: ['read', 'write'],
    ownerId: 'user1',
  };

  beforeEach(async () => {
    const tokenSelector = (id: string) => (id === mockToken.id ? mockToken : null);

    store = {
      dispatch: jest.fn().mockReturnValue(of(undefined)),
      selectSignal: jest.fn().mockReturnValue(signal(tokenSelector)),
      selectSnapshot: jest.fn().mockReturnValue(tokenSelector),
    };
    confirmationService = {
      confirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TokenDetailsComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        MockProvider(ToastService),
        { provide: Store, useValue: store },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: MessageService, useValue: {} }, // ✅ ADD THIS LINE
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: mockToken.id }),
            snapshot: {
              params: { id: mockToken.id },
              queryParams: {},
            },
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
