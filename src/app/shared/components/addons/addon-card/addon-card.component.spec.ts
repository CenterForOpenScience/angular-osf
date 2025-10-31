import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CredentialsFormat } from '@osf/shared/enums/addons-credentials-format.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { AddonModel } from '@shared/models/addons/addon.model';

import { AddonCardComponent } from './addon-card.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddonCardComponent', () => {
  let component: AddonCardComponent;
  let fixture: ComponentFixture<AddonCardComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

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

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().withUrl('/settings/addons').build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [AddonCardComponent, OSFTestingModule],
      providers: [
        provideMockStore({}),
        MockProvider(Router, mockRouter),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', mockAddon);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to connect-addon route when addon exists', () => {
    component.onConnectAddon();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings/addons/connect-addon'], {
      state: { addon: mockAddon },
    });
  });

  it('should navigate to configure-addon route when addon exists', () => {
    component.onConfigureAddon();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings/addons/configure-addon'], {
      state: { addon: mockAddon },
    });
  });

  it('should call confirmDelete on customConfirmationService', () => {
    component.showDisableDialog();

    expect(customConfirmationServiceMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.addons.messages.deleteConfirmation.title',
      messageKey: 'settings.addons.messages.deleteConfirmation.message',
      acceptLabelKey: 'settings.addons.form.buttons.disable',
      onConfirm: expect.any(Function),
    });
  });
});
