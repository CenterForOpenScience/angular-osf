import { ProviderShortInfoModel } from '@osf/shared/models';

export interface ProviderStateModel {
  currentProvider: ProviderShortInfoModel | null;
}

export const PROVIDER_STATE_INITIAL: ProviderStateModel = {
  currentProvider: null,
};
