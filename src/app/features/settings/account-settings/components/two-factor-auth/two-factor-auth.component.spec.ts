import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@osf/core/store/user';

import { AccountSettingsState } from '../../store/account-settings.state';

import { TwoFactorAuthComponent } from './two-factor-auth.component';

describe('TwoFactorAuthComponent', () => {
  let component: TwoFactorAuthComponent;
  let fixture: ComponentFixture<TwoFactorAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFactorAuthComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([UserState, AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(TranslateService),
        MockProvider(DialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoFactorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
