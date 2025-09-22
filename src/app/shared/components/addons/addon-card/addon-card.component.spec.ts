import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CredentialsFormat } from '@shared/enums';
import { MockCustomConfirmationServiceProvider } from '@shared/mocks';
import { Addon } from '@shared/models';
import { CustomConfirmationService } from '@shared/services';

import { AddonCardComponent } from './addon-card.component';

describe('AddonCardComponent', () => {
  let component: AddonCardComponent;
  let fixture: ComponentFixture<AddonCardComponent>;
  let router: Router;
  let customConfirmationService: CustomConfirmationService;
  let store: Store;

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

  const mockRouter = {
    navigate: jest.fn(),
    url: '/settings/addons',
  };

  const mockStore = {
    dispatch: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(TranslatePipe),
        MockProvider(Store, mockStore),
        MockCustomConfirmationServiceProvider,
        MockProvider(Router, mockRouter),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', mockAddon);

    router = TestBed.inject(Router);
    customConfirmationService = TestBed.inject(CustomConfirmationService);
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to connect-addon route when addon exists', () => {
    component.onConnectAddon();

    expect(router.navigate).toHaveBeenCalledWith(['/settings/addons/connect-addon'], {
      state: { addon: mockAddon },
    });
  });

  it('should navigate to configure-addon route when addon exists', () => {
    component.onConfigureAddon();

    expect(router.navigate).toHaveBeenCalledWith(['/settings/addons/configure-addon'], {
      state: { addon: mockAddon },
    });
  });

  it('should call confirmDelete on customConfirmationService', () => {
    component.showDisableDialog();

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.addons.messages.deleteConfirmation.title',
      messageKey: 'settings.addons.messages.deleteConfirmation.message',
      acceptLabelKey: 'settings.addons.form.buttons.disable',
      onConfirm: expect.any(Function),
    });
  });

  it('should dispatch delete action on success', () => {
    component.onDisableAddon();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
