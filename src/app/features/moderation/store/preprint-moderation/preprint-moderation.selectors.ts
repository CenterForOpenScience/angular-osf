import { Selector } from '@ngxs/store';

import { PreprintModerationStateModel } from './preprint-moderation.model';
import { PreprintModerationState } from './preprint-moderation.state';

export class PreprintModerationSelectors {
  @Selector([PreprintModerationState])
  static getPreprintProviders(state: PreprintModerationStateModel) {
    return state.preprintProviders.data;
  }

  @Selector([PreprintModerationState])
  static arePreprintProviderLoading(state: PreprintModerationStateModel) {
    return state.preprintProviders.isLoading;
  }

  @Selector([PreprintModerationState])
  static getPreprintProvider(state: PreprintModerationStateModel) {
    return (id: string) => state.preprintProviders.data.find((item) => item.id === id);
  }

  @Selector([PreprintModerationState])
  static getPreprintReviews(state: PreprintModerationStateModel) {
    return state.reviewActions.data;
  }

  @Selector([PreprintModerationState])
  static arePreprintReviewsLoading(state: PreprintModerationStateModel) {
    return state.reviewActions.isLoading;
  }

  @Selector([PreprintModerationState])
  static getPreprintReviewsTotalCount(state: PreprintModerationStateModel) {
    return state.reviewActions.totalCount;
  }
}
