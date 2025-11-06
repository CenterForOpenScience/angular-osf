import { Selector } from '@ngxs/store';

import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';
import { ProviderShortInfoModel } from '@shared/models/provider/provider.model';

import { ProviderStateModel } from './provider.model';
import { ProviderState } from './provider.state';

export class ProviderSelectors {
  @Selector([ProviderState])
  static getCurrentProvider(state: ProviderStateModel): ProviderShortInfoModel | null {
    return state.currentProvider;
  }

  @Selector([ProviderState])
  static hasAdminAccess(state: ProviderStateModel): boolean {
    return (
      state.currentProvider?.permissions?.some((permission) => permission === ReviewPermissions.SetUpModeration) ||
      false
    );
  }
}
