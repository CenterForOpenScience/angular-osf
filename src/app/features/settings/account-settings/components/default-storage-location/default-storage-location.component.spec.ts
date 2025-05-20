import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@osf/core/store/user';

import { AccountSettingsState } from '../../store/account-settings.state';

import { DefaultStorageLocationComponent } from './default-storage-location.component';

describe('DefaultStorageLocationComponent', () => {
  let component: DefaultStorageLocationComponent;
  let fixture: ComponentFixture<DefaultStorageLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultStorageLocationComponent, MockPipe(TranslatePipe)],
      providers: [provideStore([AccountSettingsState, UserState]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultStorageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
