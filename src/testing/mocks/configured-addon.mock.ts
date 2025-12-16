import { ConfiguredAddonModel } from '@shared/models/addons/configured-addon.model';

import { MOCK_ADDON } from './addon.mock';

export const MOCK_CONFIGURED_ADDON: ConfiguredAddonModel = {
  ...MOCK_ADDON,
  connectedCapabilities: ['READ', 'WRITE'],
  connectedOperationNames: ['list_collection_items'],
  currentUserIsOwner: true,
  selectedStorageItemId: 'item1',
  resourceType: 'project',
  baseAccountId: 'account1',
  baseAccountType: 'authorized-addon-account',
};
