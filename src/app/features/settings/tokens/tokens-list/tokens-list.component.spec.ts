import { Store } from '@ngxs/store';

import { Confirmation, ConfirmationService } from 'primeng/api';

import { BehaviorSubject } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Token } from '@osf/features/settings/tokens/entities/tokens.models';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { TokensListComponent } from './tokens-list.component';

describe('TokensListComponent', () => {
  let component: TokensListComponent;
  let fixture: ComponentFixture<TokensListComponent>;
  let store: jasmine.SpyObj<Store>;
  let confirmationService: jasmine.SpyObj<ConfirmationService>;
  let isXSmall$: BehaviorSubject<boolean>;

  const mockTokens: Token[] = [
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
    store = jasmine.createSpyObj('Store', ['dispatch', 'selectSignal']);
    confirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    isXSmall$ = new BehaviorSubject<boolean>(false);

    store.selectSignal.and.returnValue(signal(mockTokens));

    await TestBed.configureTestingModule({
      imports: [TokensListComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: IS_XSMALL, useValue: isXSmall$ },
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
    store.selectSignal.and.returnValue(signal(mockTokens));
    component.ngOnInit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should show confirmation dialog when deleting token', () => {
    const token = mockTokens[0];
    component.deleteToken(token);
    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should dispatch delete action when confirmation is accepted', () => {
    const token = mockTokens[0];
    confirmationService.confirm.and.callFake((config: Confirmation) => {
      if (config.accept) {
        config.accept();
      }
      return confirmationService;
    });
    component.deleteToken(token);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should update isXSmall signal when breakpoint changes', () => {
    isXSmall$.next(true);
    fixture.detectChanges();
    expect(component['isXSmall']()).toBeTrue();
  });
});
