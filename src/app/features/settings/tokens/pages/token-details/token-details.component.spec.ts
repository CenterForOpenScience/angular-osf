import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { TokenAddEditFormComponent } from '../../components';
import { TokenModel } from '../../models';
import { TokensSelectors } from '../../store';

import { TokenDetailsComponent } from './token-details.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';

describe('TokenDetailsComponent', () => {
  let component: TokenDetailsComponent;
  let fixture: ComponentFixture<TokenDetailsComponent>;
  let confirmationService: Partial<CustomConfirmationService>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockToken: TokenModel = {
    id: '1',
    tokenId: '2',
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
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    confirmationService = {
      confirmDelete: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        TokenDetailsComponent,
        OSFTestingModule,
        ...MockComponents(TokenAddEditFormComponent, IconComponent, LoadingSpinnerComponent),
      ],
      providers: [
        MockProvider(Store, storeMock),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(CustomDialogService, mockCustomDialogService),
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
