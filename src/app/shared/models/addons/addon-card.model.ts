import { AddonModel } from './addon.model';
import { ConfiguredAddonModel } from './configured-addon.model';

export interface AddonCardModel {
  id: string;
  type: string;
  displayName: string;
  externalServiceName: string;
  iconUrl?: string;
  isConfigured: boolean;
  addon: AddonModel;
  configuredAddon?: ConfiguredAddonModel;
}
