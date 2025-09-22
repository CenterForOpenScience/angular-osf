import { AddonModel } from './addons.models';
import { ConfiguredAddonModel } from './configured-addon.model';

export interface AddonCardModel {
  addon: AddonModel;
  isConfigured: boolean;
  configuredAddon?: ConfiguredAddonModel;
}
