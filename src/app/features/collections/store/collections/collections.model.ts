import {
  CollectionDetails,
  CollectionProvider,
  CollectionsFilters,
  CollectionSubmission,
} from '@osf/features/collections/models';
import { AsyncStateModel } from '@shared/models/store';

export interface CollectionsStateModel {
  currentFilters: CollectionsFilters;
  filtersOptions: CollectionsFilters;
  collectionProvider: AsyncStateModel<CollectionProvider | null>;
  collectionDetails: AsyncStateModel<CollectionDetails | null>;
  collectionSubmissions: AsyncStateModel<CollectionSubmission[]>;
  userCollectionSubmissions: AsyncStateModel<CollectionSubmission[]>;
  totalSubmissions: number;
  sortBy: string;
  searchText: string;
  page: string;
}
