import { Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';

import { BehaviorSubject, of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, RouterModule } from '@angular/router';

import { Token } from '@osf/features/settings/tokens/entities/tokens.models';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { TokenDetailsComponent } from './token-details.component';

describe('TokenDetailsComponent', () => {
  let component: TokenDetailsComponent;
  let fixture: ComponentFixture<TokenDetailsComponent>;
  let store: Partial<Store>;
  let confirmationService: Partial<ConfirmationService>;
  let isXSmallSubject: BehaviorSubject<boolean>;

  const mockToken: Token = {
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
    isXSmallSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [TokenDetailsComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        { provide: Store, useValue: store },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: IS_XSMALL, useValue: isXSmallSubject },
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
