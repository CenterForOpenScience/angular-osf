import { AddonModel, AuthorizedStorageAccountModel, ConfiguredStorageAddonModel } from '@shared/models';

export function isStorageAddon(
  addon: AddonModel | AuthorizedStorageAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return (
    addon.type === 'external-storage-services' ||
    addon.type === 'authorized-storage-accounts' ||
    addon.type === 'configured-storage-addons'
  );
}

export function isCitationAddon(
  addon: AddonModel | AuthorizedStorageAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return (
    addon.type === 'external-citation-services' ||
    addon.type === 'authorized-citation-accounts' ||
    addon.type === 'configured-citation-addons'
  );
}

export function getAddonTypeString(
  addon: AddonModel | AuthorizedStorageAccountModel | ConfiguredStorageAddonModel | null
): string {
  if (!addon) return '';

  return isStorageAddon(addon) ? 'storage' : 'citation';
}

export function isAuthorizedAddon(
  addon: AddonModel | AuthorizedStorageAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return addon.type === 'authorized-storage-accounts' || addon.type === 'authorized-citation-accounts';
}

export function isConfiguredAddon(
  addon: AddonModel | AuthorizedStorageAccountModel | ConfiguredStorageAddonModel | null
): boolean {
  if (!addon) return false;

  return addon.type === 'configured-storage-addons' || addon.type === 'configured-citation-addons';
}
