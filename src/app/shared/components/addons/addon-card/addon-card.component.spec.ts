import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { CredentialsFormat } from '@osf/shared/enums/addons-credentials-format.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { AddonModel } from '@shared/models/addons/addon.model';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { AddonCardComponent } from './addon-card.component';

interface SetupOverrides extends BaseSetupOverrides {
  selectorOverrides?: SignalOverride[];
}

describe('AddonCardComponent', () => {
  let component: AddonCardComponent;
  let fixture: ComponentFixture<AddonCardComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  const defaultSignals: SignalOverride[] = [{ selector: UserSelectors.isProjectReadOnly, value: false }];

  const mockAddon: AddonModel = {
    id: 'test-addon-id',
    type: 'external-storage-services',
    displayName: 'Test Addon',
    credentialsFormat: CredentialsFormat.OAUTH2,
    supportedFeatures: ['ACCESS'],
    providerName: 'Test Provider',
    authUrl: 'https://test.com/auth',
    externalServiceName: 'test-service',
  };

  const setup = function (overrides?: SetupOverrides) {
    mockRouter = RouterMockBuilder.create().withUrl('/settings/addons').build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [AddonCardComponent],
      providers: [
        provideOSFCore(),
        provideMockStore(),
        MockProvider(Router, mockRouter),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides),
        }),
      ],
    });

    fixture = TestBed.createComponent(AddonCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', mockAddon);

    fixture.detectChanges();
  };

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should compute shouldDisableConnect when isProjectReadOnly false', () => {
    expect(component.shouldDisableConnect()).toBe(false);

    fixture.componentRef.setInput('isConnected', true);
    fixture.detectChanges();
    expect(component.shouldDisableConnect()).toBe(false);

    fixture.componentRef.setInput('card', { ...mockAddon, type: 'external-citation-services' });
    fixture.detectChanges();
    expect(component.shouldDisableConnect()).toBe(false);
  });

  it('should compute shouldDisableConnect when isProjectReadOnly true', () => {
    setup({ selectorOverrides: [{ selector: UserSelectors.isProjectReadOnly, value: true }] });
    expect(component.shouldDisableConnect()).toBe(true);

    fixture.componentRef.setInput('isConnected', true);
    fixture.detectChanges();
    expect(component.shouldDisableConnect()).toBe(false);

    fixture.componentRef.setInput('card', { ...mockAddon, type: 'external-citation-services' });
    fixture.componentRef.setInput('isConnected', false);
    fixture.detectChanges();
    expect(component.shouldDisableConnect()).toBe(false);
  });

  it('should navigate to connect-addon route when addon exists', () => {
    setup();
    component.onConnectAddon();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings/addons/connect-addon'], {
      state: { addon: mockAddon },
    });
  });

  it('should navigate to configure-addon route when addon exists', () => {
    setup();
    component.onConfigureAddon();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings/addons/configure-addon'], {
      state: { addon: mockAddon },
    });
  });

  it('should call confirmDelete on customConfirmationService', () => {
    setup();
    component.showDisableDialog();

    expect(customConfirmationServiceMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.addons.messages.deleteConfirmation.title',
      messageKey: 'settings.addons.messages.deleteConfirmation.message',
      acceptLabelKey: 'common.buttons.disable',
      onConfirm: expect.any(Function),
    });
  });
});
