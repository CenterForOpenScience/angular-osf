import { ProviderModel } from '@osf/shared/models';

export interface ProviderStateModel {
  currentProvider: ProviderModel | null;
}

export const PROVIDER_STATE_INITIAL: ProviderStateModel = {
  currentProvider: null,
};
