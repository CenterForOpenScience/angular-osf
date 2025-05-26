import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsState } from '@osf/features/settings/account-settings/store';

import { VerifyTwoFactorComponent } from './verify-two-factor.component';

describe('VerifyTwoFactorComponent', () => {
  let component: VerifyTwoFactorComponent;
  let fixture: ComponentFixture<VerifyTwoFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyTwoFactorComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(TranslateService),
        MockProviders(DynamicDialogRef, DynamicDialogConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
