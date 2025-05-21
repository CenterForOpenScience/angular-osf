import { AsyncStateModel } from '@osf/shared/models/store';

export interface CollectionsStateModel {
  bookmarksId: AsyncStateModel<string>;
}
