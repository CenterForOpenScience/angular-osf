import { CredentialsFormat } from '@osf/shared/enums/addons-credentials-format.enum';
import { AddonModel } from '@shared/models/addons/addon.model';

export const MOCK_ADDON: AddonModel = {
  type: 'addon',
  id: 'id1',
  authUrl: 'https://test.com/auth',
  displayName: 'Test Addon',
  externalServiceName: 'test-service',
  supportedFeatures: ['ACCESS', 'UPDATE'],
  credentialsFormat: CredentialsFormat.ACCESS_SECRET_KEYS,
  providerName: 'Test Provider',
  wbKey: 'github',
  iconUrl: 'https://test.com/icon.png',
  configurableApiRoot: false,
};
