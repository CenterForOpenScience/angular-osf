import { CredentialsFormat } from '@shared/enums';
import { Addon } from '@shared/models';

export const MOCK_ADDON: Addon = {
  type: 'addon',
  id: 'id1',
  authUrl: 'https://test.com/auth',
  displayName: 'Test Addon',
  externalServiceName: 'test-service',
  supportedFeatures: ['ACCESS', 'UPDATE'],
  credentialsFormat: CredentialsFormat.ACCESS_SECRET_KEYS,
  providerName: 'Test Provider',
};
