import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsState } from '@osf/features/settings/account-settings/store/account-settings.state';

import { ConfigureTwoFactorComponent } from './configure-two-factor.component';

describe('ConfigureTwoFactorComponent', () => {
  let component: ConfigureTwoFactorComponent;
  let fixture: ComponentFixture<ConfigureTwoFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureTwoFactorComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(DynamicDialogRef, DynamicDialogConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigureTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
