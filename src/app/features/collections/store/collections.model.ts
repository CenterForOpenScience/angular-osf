import { AsyncStateModel } from '@osf/shared/models/store';

export interface CollectionsFilters {
  programArea: string[];
  status: string[];
  collectedType: string[];
  dataType: string[];
  disease: string[];
  gradeLevels: string[];
  issue: string[];
  reviewsState: string[];
  schoolType: string[];
  studyDesign: string[];
  volume: string[];
}

export interface CollectionsStateModel {
  bookmarksId: AsyncStateModel<string>;
  filters: CollectionsFilters;
  filtersOptions: CollectionsFilters;
}
