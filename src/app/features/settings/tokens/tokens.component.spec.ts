import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IS_SMALL } from '@osf/shared/helpers';
import { MOCK_STORE } from '@shared/mocks';
import { CustomDialogService } from '@shared/services';

import { GetScopes } from './store';
import { TokensComponent } from './tokens.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { DialogServiceMockBuilder } from '@testing/providers/dialog-provider.mock';

describe('TokensComponent', () => {
  let component: TokensComponent;
  let fixture: ComponentFixture<TokensComponent>;
  let isSmallSubject: BehaviorSubject<boolean>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockDialogService: ReturnType<DialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withOpen(jest.fn()).build();
    mockDialogService = DialogServiceMockBuilder.create().withOpenMock().build();
    isSmallSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [TokensComponent, OSFTestingModule],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(IS_SMALL, isSmallSubject),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(DialogService, mockDialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensComponent);
    component = fixture.componentInstance;
    (MOCK_STORE.dispatch as jest.Mock).mockClear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getScopes on init', () => {
    expect(MOCK_STORE.dispatch).toHaveBeenCalledWith(new GetScopes());
  });

  it('should open create token dialog with correct config', () => {
    component.createToken();
    expect(mockCustomDialogService.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'settings.tokens.form.createTitle',
      })
    );
  });

  it('should use width 95vw when IS_SMALL is false', () => {
    isSmallSubject.next(false);
    fixture.detectChanges();
    component.createToken();
    expect(mockCustomDialogService.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ width: '95vw' })
    );
  });

  it('should use width 800px when IS_SMALL is true', () => {
    isSmallSubject.next(true);
    fixture.detectChanges();
    component.createToken();
    expect(mockCustomDialogService.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ width: '800px ' })
    );
  });
});
