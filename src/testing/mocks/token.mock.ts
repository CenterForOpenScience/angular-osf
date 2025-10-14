import { TokenModel } from '@osf/features/settings/tokens/models';

export const MOCK_TOKEN: TokenModel = {
  id: '1',
  name: 'Test Token',
  tokenId: 'abcd1234efgh5678',
  scopes: ['read', 'write'],
};
