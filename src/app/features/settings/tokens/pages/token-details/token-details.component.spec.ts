import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CustomConfirmationService } from '@shared/services';

import { TokenModel } from '../../models';
import { TokensSelectors } from '../../store';

import { TokenDetailsComponent } from './token-details.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('TokenDetailsComponent', () => {
  let component: TokenDetailsComponent;
  let fixture: ComponentFixture<TokenDetailsComponent>;
  let confirmationService: Partial<CustomConfirmationService>;

  const mockToken: TokenModel = {
    id: '1',
    name: 'Test Token',
    scopes: ['read', 'write'],
  };

  const storeMock = {
    dispatch: jest.fn().mockReturnValue(of({})),
    selectSnapshot: jest.fn().mockImplementation((selector: unknown) => {
      if (selector === TokensSelectors.getTokenById) {
        return (id: string) => (id === mockToken.id ? mockToken : null);
      }
      return null;
    }),
    selectSignal: jest.fn().mockImplementation((selector: unknown) => {
      if (selector === TokensSelectors.isTokensLoading) return () => false;
      if (selector === TokensSelectors.getTokenById)
        return () => (id: string) => (id === mockToken.id ? mockToken : null);
      return () => null;
    }),
  } as unknown as jest.Mocked<Store>;

  beforeEach(async () => {
    confirmationService = {
      confirmDelete: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TokenDetailsComponent, OSFTestingStoreModule],
      providers: [
        MockProvider(Store, storeMock),
        MockProvider(CustomConfirmationService, confirmationService),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: mockToken.id }),
            snapshot: {
              paramMap: new Map(Object.entries({ id: mockToken.id })),
              params: { id: mockToken.id },
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetTokenById on init when tokenId exists', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should confirm and delete token on deleteToken()', () => {
    (confirmationService.confirmDelete as jest.Mock).mockImplementation(({ onConfirm }: any) => onConfirm());

    component.deleteToken();

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'settings.tokens.confirmation.delete.title',
        messageKey: 'settings.tokens.confirmation.delete.message',
      })
    );
    expect(storeMock.dispatch).toHaveBeenCalled();
  });
});
