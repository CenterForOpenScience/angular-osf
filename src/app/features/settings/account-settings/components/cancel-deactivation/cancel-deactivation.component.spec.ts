import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsState } from '@osf/features/settings/account-settings/store';

import { CancelDeactivationComponent } from './cancel-deactivation.component';

describe('CancelDeactivationComponent', () => {
  let component: CancelDeactivationComponent;
  let fixture: ComponentFixture<CancelDeactivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelDeactivationComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(DynamicDialogRef),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelDeactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
