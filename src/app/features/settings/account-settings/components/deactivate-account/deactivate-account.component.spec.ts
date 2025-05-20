import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { AccountSettingsState } from '../../store/account-settings.state';

import { DeactivateAccountComponent } from './deactivate-account.component';

describe('DeactivateAccountComponent', () => {
  let component: DeactivateAccountComponent;
  let fixture: ComponentFixture<DeactivateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateAccountComponent, MockPipe(TranslatePipe)],
      providers: [
        provideNoopAnimations(),
        provideStore([AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(DynamicDialogRef, DialogService, TranslateService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
