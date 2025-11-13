import { AddonTabValue } from '@shared/enums/addon-tab.enum';
import { SelectOption } from '@shared/models/select-option.model';

export const ADDON_TAB_OPTIONS: SelectOption[] = [
  {
    label: 'settings.addons.tabs.allAddons',
    value: AddonTabValue.ALL_ADDONS,
  },
  {
    label: 'settings.addons.tabs.connectedAddons',
    value: AddonTabValue.CONNECTED_ADDONS,
  },
  {
    label: 'settings.addons.tabs.linkedServices',
    value: AddonTabValue.LINK_ADDONS,
  },
];
