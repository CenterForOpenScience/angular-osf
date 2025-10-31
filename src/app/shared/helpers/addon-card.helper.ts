import { AddonModel } from '../models/addons/addon.model';
import { AddonCardModel } from '../models/addons/addon-card.model';
import { ConfiguredAddonModel } from '../models/addons/configured-addon.model';

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
