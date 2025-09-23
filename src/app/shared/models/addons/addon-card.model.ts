import { AddonModel, ConfiguredAddonModel } from '@shared/models';

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
