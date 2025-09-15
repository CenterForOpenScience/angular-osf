import { CredentialsFormat } from '@shared/enums';
import { AddonModel } from '@shared/models';

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
};
