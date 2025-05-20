import { Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { BehaviorSubject, of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { IS_MEDIUM, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { TokensComponent } from './tokens.component';

describe('TokensComponent', () => {
  let component: TokensComponent;
  let fixture: ComponentFixture<TokensComponent>;
  let store: Partial<Store>;
  let dialogService: Partial<DialogService>;
  let isXSmallSubject: BehaviorSubject<boolean>;
  let isMediumSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isXSmallSubject = new BehaviorSubject<boolean>(false);
    isMediumSubject = new BehaviorSubject<boolean>(false);
    store = {
      dispatch: jest.fn().mockReturnValue(of(undefined)),
    };

    dialogService = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TokensComponent, MockComponent(SubHeaderComponent), TranslateModule.forRoot()],
      providers: [
        MockProvider(Store, store),
        MockProvider(DialogService, dialogService),
        MockProvider(IS_XSMALL, isXSmallSubject),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
