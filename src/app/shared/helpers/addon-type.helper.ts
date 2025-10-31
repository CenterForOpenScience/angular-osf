import { AddonModel } from '@shared/models/addons/addon.model';
import { AuthorizedAccountModel } from '@shared/models/addons/authorized-account.model';
import { ConfiguredAddonModel } from '@shared/models/addons/configured-addon.model';

import { AddonType, AuthorizedAccountType, ConfiguredAddonType } from '../enums/addon-type.enum';
import { AddonCategory } from '../enums/addons-category.enum';

export function isStorageAddon(addon: AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AddonCategory.EXTERNAL_STORAGE_SERVICES ||
    addon.type === AuthorizedAccountType.STORAGE ||
    addon.type === ConfiguredAddonType.STORAGE
  );
}

export function isCitationAddon(addon: AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AddonCategory.EXTERNAL_CITATION_SERVICES ||
    addon.type === AuthorizedAccountType.CITATION ||
    addon.type === ConfiguredAddonType.CITATION
  );
}

export function isLinkAddon(addon: AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AddonCategory.EXTERNAL_LINK_SERVICES ||
    addon.type === AuthorizedAccountType.LINK ||
    addon.type === ConfiguredAddonType.LINK
  );
}

export function getAddonTypeString(addon: AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | null): string {
  if (!addon) return '';

  if (isStorageAddon(addon)) {
    return AddonType.STORAGE;
  } else if (isLinkAddon(addon)) {
    return AddonType.LINK;
  } else {
    return AddonType.CITATION;
  }
}

export function isAuthorizedAddon(addon: AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AuthorizedAccountType.STORAGE ||
    addon.type === AuthorizedAccountType.CITATION ||
    addon.type === AuthorizedAccountType.LINK
  );
}

export function isConfiguredAddon(addon: AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | null): boolean {
  if (!addon) return false;

  return (
    addon.type === ConfiguredAddonType.STORAGE ||
    addon.type === ConfiguredAddonType.CITATION ||
    addon.type === ConfiguredAddonType.LINK
  );
}

export function isAddonServiceConfigured(addon: AddonModel | null, configuredAddons: ConfiguredAddonModel[]): boolean {
  if (!addon) return false;

  return configuredAddons.some((configuredAddon) => configuredAddon.externalServiceName === addon.externalServiceName);
}
