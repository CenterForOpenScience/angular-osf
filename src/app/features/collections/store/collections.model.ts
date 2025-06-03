import { CollectionsFilters } from '@osf/features/collections/models';
import { AsyncStateModel } from '@osf/shared/models/store';

export interface CollectionsStateModel {
  bookmarksId: AsyncStateModel<string>;
  filters: CollectionsFilters;
  filtersOptions: CollectionsFilters;
}
