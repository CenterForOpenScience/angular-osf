import { AddonCategory, AddonType, AuthorizedAccountType, ConfiguredAddonType } from '@shared/enums';
import { Addon, AuthorizedAccount, ConfiguredAddon } from '@shared/models';

export function isStorageAddon(addon: Addon | AuthorizedAccount | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AddonCategory.EXTERNAL_STORAGE_SERVICES ||
    addon.type === AuthorizedAccountType.STORAGE ||
    addon.type === ConfiguredAddonType.STORAGE
  );
}

export function isCitationAddon(addon: Addon | AuthorizedAccount | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AddonCategory.EXTERNAL_CITATION_SERVICES ||
    addon.type === AuthorizedAccountType.CITATION ||
    addon.type === ConfiguredAddonType.CITATION
  );
}

export function isLinkAddon(addon: Addon | AuthorizedAccount | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AddonCategory.EXTERNAL_LINK_SERVICES ||
    addon.type === AuthorizedAccountType.LINK ||
    addon.type === ConfiguredAddonType.LINK
  );
}

export function getAddonTypeString(addon: Addon | AuthorizedAccount | ConfiguredAddon | null): string {
  if (!addon) return '';

  if (isStorageAddon(addon)) {
    return AddonType.STORAGE;
  } else if (isLinkAddon(addon)) {
    return AddonType.LINK;
  } else {
    return AddonType.CITATION;
  }
}

export function isAuthorizedAddon(addon: Addon | AuthorizedAccount | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return (
    addon.type === AuthorizedAccountType.STORAGE ||
    addon.type === AuthorizedAccountType.CITATION ||
    addon.type === AuthorizedAccountType.LINK
  );
}

export function isConfiguredAddon(addon: Addon | AuthorizedAccount | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return (
    addon.type === ConfiguredAddonType.STORAGE ||
    addon.type === ConfiguredAddonType.CITATION ||
    addon.type === ConfiguredAddonType.LINK
  );
}

export function isAddonServiceConfigured(addon: Addon | null, configuredAddons: ConfiguredAddon[]): boolean {
  if (!addon) return false;

  return configuredAddons.some((configuredAddon) => configuredAddon.externalServiceName === addon.externalServiceName);
}
