import {
  CollectionDetails,
  CollectionProvider,
  CollectionSubmission,
  CollectionSubmissionWithGuid,
} from '@osf/shared/models/collections/collections.models';
import { CollectionsFilters } from '@osf/shared/models/collections/collections-filters.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface CollectionsStateModel {
  currentFilters: CollectionsFilters;
  filtersOptions: CollectionsFilters;
  collectionProvider: AsyncStateModel<CollectionProvider | null>;
  collectionDetails: AsyncStateModel<CollectionDetails | null>;
  collectionSubmissions: AsyncStateModel<CollectionSubmissionWithGuid[]>;
  userCollectionSubmissions: AsyncStateModel<CollectionSubmissionWithGuid[]>;
  currentProjectSubmissions: AsyncStateModel<CollectionSubmission[]>;
  totalSubmissions: number;
  sortBy: string;
  searchText: string;
  page: string;
}

export const FILTERS_DEFAULTS = {
  programArea: [],
  status: [],
  collectedType: [],
  dataType: [],
  disease: [],
  gradeLevels: [],
  issue: [],
  reviewsState: [],
  schoolType: [],
  studyDesign: [],
  volume: [],
};

export const COLLECTIONS_DEFAULTS: CollectionsStateModel = {
  currentFilters: FILTERS_DEFAULTS,
  filtersOptions: FILTERS_DEFAULTS,
  collectionProvider: {
    data: null,
    isLoading: false,
    error: null,
  },
  collectionDetails: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  collectionSubmissions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  userCollectionSubmissions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  currentProjectSubmissions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  totalSubmissions: 0,
  sortBy: '',
  searchText: '',
  page: '1',
};
