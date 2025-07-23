import { Selector } from '@ngxs/store';

import { CollectionsModerationStateModel } from './collections-moderation.model';
import { CollectionsModerationState } from './collections-moderation.state';

export class CollectionsModerationSelectors {
  @Selector([CollectionsModerationState])
  static getCollectionSubmissions(state: CollectionsModerationStateModel) {
    return state.collectionSubmissions.data;
  }
}
