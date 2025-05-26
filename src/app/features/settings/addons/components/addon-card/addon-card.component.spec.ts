import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsFormat } from '../../enums';
import { Addon } from '../../models';

import { AddonCardComponent } from './addon-card.component';

describe('AddonCardComponent', () => {
  let component: AddonCardComponent;
  let fixture: ComponentFixture<AddonCardComponent>;

  const mockAddon: Addon = {
    id: 'test-addon-id',
    type: 'external-storage-services',
    displayName: 'Test Addon',
    credentialsFormat: CredentialsFormat.OAUTH2,
    supportedFeatures: ['ACCESS'],
    providerName: 'Test Provider',
    authUrl: 'https://test.com/auth',
    externalServiceName: 'test-service',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(TranslatePipe), MockProvider(Store)],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', mockAddon);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
