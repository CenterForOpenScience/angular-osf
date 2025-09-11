import { AddonCategory, AddonType, AuthorizedAccountType, ConfiguredAddonType } from '@shared/enums';
import { AddonModel, AuthorizedAccountModel, ConfiguredAddonModel } from '@shared/models';

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
