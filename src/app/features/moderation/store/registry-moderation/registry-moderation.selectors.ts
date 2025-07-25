import { Selector } from '@ngxs/store';

import { RegistryModerationStateModel } from './registry-moderation.model';
import { RegistryModerationState } from './registry-moderation.state';

export class RegistryModerationSelectors {
  @Selector([RegistryModerationState])
  static getRegistrySubmissions(state: RegistryModerationStateModel) {
    return state.submissions.data;
  }

  @Selector([RegistryModerationState])
  static areRegistrySubmissionLoading(state: RegistryModerationStateModel) {
    return state.submissions.isLoading;
  }

  @Selector([RegistryModerationState])
  static getRegistrySubmissionTotalCount(state: RegistryModerationStateModel) {
    return state.submissions.totalCount;
  }
}
