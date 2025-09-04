import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IS_SMALL } from '@osf/shared/helpers';
import { MOCK_STORE } from '@shared/mocks';

import { GetScopes } from './store';
import { TokensComponent } from './tokens.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('TokensComponent', () => {
  let component: TokensComponent;
  let fixture: ComponentFixture<TokensComponent>;
  let dialogService: DialogService;
  let isSmallSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isSmallSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [TokensComponent, OSFTestingModule],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(DynamicDialogRef, {}),
        MockProvider(IS_SMALL, isSmallSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensComponent);
    component = fixture.componentInstance;
    dialogService = fixture.debugElement.injector.get(DialogService);
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
    const openSpy = jest.spyOn(dialogService, 'open');
    component.createToken();
    expect(openSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'settings.tokens.form.createTitle',
        modal: true,
        closeOnEscape: true,
        closable: true,
      })
    );
  });

  it('should use width 95vw when IS_SMALL is false', () => {
    const openSpy = jest.spyOn(dialogService, 'open');
    isSmallSubject.next(false);
    fixture.detectChanges();
    component.createToken();
    expect(openSpy).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ width: '95vw' }));
  });

  it('should use width 800px when IS_SMALL is true', () => {
    const openSpy = jest.spyOn(dialogService, 'open');
    isSmallSubject.next(true);
    fixture.detectChanges();
    component.createToken();
    expect(openSpy).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ width: '800px ' }));
  });
});
