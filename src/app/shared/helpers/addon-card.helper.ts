import { Addon, AddonCard, ConfiguredAddon } from '../models';

export function createAddonCardModel(
  addon: Addon,
  isConfigured: boolean,
  configuredAddon?: ConfiguredAddon
): AddonCard {
  return {
    type: addon.type,
    id: addon.id,
    displayName: addon.displayName,
    externalServiceName: addon.externalServiceName,
    iconUrl: addon.iconUrl,
    addon,
    isConfigured,
    configuredAddon,
  };
}

export function sortAddonCardsAlphabetically<T extends Addon>(cards: T[]): T[] {
  return cards.sort((a, b) => a.externalServiceName.localeCompare(b.externalServiceName));
}
