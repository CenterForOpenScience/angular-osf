import { Addon, AuthorizedAddon, ConfiguredAddon } from '@shared/models';

export function isStorageAddon(addon: Addon | AuthorizedAddon | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return (
    addon.type === 'external-storage-services' ||
    addon.type === 'authorized-storage-accounts' ||
    addon.type === 'configured-storage-addons'
  );
}

export function isCitationAddon(addon: Addon | AuthorizedAddon | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return (
    addon.type === 'external-citation-services' ||
    addon.type === 'authorized-citation-accounts' ||
    addon.type === 'configured-citation-addons'
  );
}

export function getAddonTypeString(addon: Addon | AuthorizedAddon | ConfiguredAddon | null): string {
  if (!addon) return '';

  return isStorageAddon(addon) ? 'storage' : 'citation';
}

export function isAuthorizedAddon(addon: Addon | AuthorizedAddon | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return addon.type === 'authorized-storage-accounts' || addon.type === 'authorized-citation-accounts';
}

export function isConfiguredAddon(addon: Addon | AuthorizedAddon | ConfiguredAddon | null): boolean {
  if (!addon) return false;

  return addon.type === 'configured-storage-addons' || addon.type === 'configured-citation-addons';
}
