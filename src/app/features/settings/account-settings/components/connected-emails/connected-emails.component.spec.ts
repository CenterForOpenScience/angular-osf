import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProviders } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@osf/core/store/user';

import { AccountSettingsState } from '../../store/account-settings.state';

import { ConnectedEmailsComponent } from './connected-emails.component';

describe('ConnectedEmailsComponent', () => {
  let component: ConnectedEmailsComponent;
  let fixture: ComponentFixture<ConnectedEmailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedEmailsComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([AccountSettingsState, UserState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(DialogService, TranslateService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
