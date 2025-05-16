import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsState } from '../../store/account-settings.state';

import { ConnectedIdentitiesComponent } from './connected-identities.component';

describe('ConnectedIdentitiesComponent', () => {
  let component: ConnectedIdentitiesComponent;
  let fixture: ComponentFixture<ConnectedIdentitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedIdentitiesComponent, MockPipe(TranslatePipe)],
      providers: [provideStore([AccountSettingsState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedIdentitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
