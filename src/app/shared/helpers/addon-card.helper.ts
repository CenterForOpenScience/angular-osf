import { AddonCardModel, AddonModel, ConfiguredAddonModel } from '../models';

export function createAddonCardModel(
  addon: AddonModel,
  isConfigured: boolean,
  configuredAddon?: ConfiguredAddonModel
): AddonCardModel {
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

export function sortAddonCardsAlphabetically<T extends AddonModel>(cards: T[]): T[] {
  return cards.sort((a, b) => a.externalServiceName.localeCompare(b.externalServiceName));
}
