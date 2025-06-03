import { SelectOption } from '@shared/models';

export enum AddonTabValue {
  ALL_ADDONS = 0,
  CONNECTED_ADDONS = 1,
}

export enum AddonCategoryValue {
  EXTERNAL_STORAGE_SERVICES = 'external-storage-services',
  EXTERNAL_CITATION_SERVICES = 'external-citation-services',
}

export const ADDON_TAB_OPTIONS: SelectOption[] = [
  {
    label: 'settings.addons.tabs.allAddons',
    value: AddonTabValue.ALL_ADDONS,
  },
  {
    label: 'settings.addons.tabs.connectedAddons',
    value: AddonTabValue.CONNECTED_ADDONS,
  },
];

export const ADDON_CATEGORY_OPTIONS: SelectOption[] = [
  {
    label: 'settings.addons.categories.additionalService',
    value: AddonCategoryValue.EXTERNAL_STORAGE_SERVICES,
  },
  {
    label: 'settings.addons.categories.citationManager',
    value: AddonCategoryValue.EXTERNAL_CITATION_SERVICES,
  },
];
