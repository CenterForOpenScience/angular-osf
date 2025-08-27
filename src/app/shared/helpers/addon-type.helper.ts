import { AddonModel, AuthorizedAccountModel, ConfiguredStorageAddonModel } from '@shared/models';

export function isStorageAddon(
  addon: AddonModel | AuthorizedAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return (
    addon.type === 'external-storage-services' ||
    addon.type === 'authorized-storage-accounts' ||
    addon.type === 'configured-storage-addons'
  );
}

export function isCitationAddon(
  addon: AddonModel | AuthorizedAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return (
    addon.type === 'external-citation-services' ||
    addon.type === 'authorized-citation-accounts' ||
    addon.type === 'configured-citation-addons'
  );
}

export function getAddonTypeString(
  addon: AddonModel | AuthorizedAccountModel | ConfiguredStorageAddonModel | null
): string {
  if (!addon) return '';

  return isStorageAddon(addon) ? 'storage' : 'citation';
}

export function isAuthorizedAddon(
  addon: AddonModel | AuthorizedAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return addon.type === 'authorized-storage-accounts' || addon.type === 'authorized-citation-accounts';
}

export function isConfiguredAddon(
  addon: AddonModel | AuthorizedAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return addon.type === 'configured-storage-addons' || addon.type === 'configured-citation-addons';
}
