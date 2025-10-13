import { DeveloperApp } from '@osf/features/settings/developer-apps/models';

export const MOCK_DEVELOPER_APP: DeveloperApp = {
  id: 'test-id',
  name: 'Test App',
  description: 'This is a test application',
  projHomePageUrl: 'https://example.com',
  authorizationCallbackUrl: 'https://example.com/callback',
  clientId: 'test-client-id',
  clientSecret: 'test-secret',
};
