import { Selector } from '@ngxs/store';

import { CollectionsFilters } from '@osf/features/collections/models';

import { CollectionsStateModel } from './collections.model';
import { CollectionsState } from './collections.state';

export class CollectionsSelectors {
  @Selector([CollectionsState])
  static getBookmarksCollectionId(state: CollectionsStateModel) {
    return state.bookmarksId.data;
  }

  @Selector([CollectionsState])
  static getBookmarksCollectionIdLoading(state: CollectionsStateModel) {
    return state.bookmarksId.isLoading;
  }

  @Selector([CollectionsState])
  static getBookmarksCollectionIdSubmitting(state: CollectionsStateModel) {
    return state.bookmarksId.isSubmitting;
  }

  @Selector([CollectionsState])
  static getAllFilters(state: CollectionsStateModel): CollectionsFilters {
    return state.filters;
  }

  @Selector([CollectionsState])
  static getStatusFilters(state: CollectionsStateModel): string[] {
    return state.filters.status;
  }

  @Selector([CollectionsState])
  static getProgramAreaFilters(state: CollectionsStateModel): string[] {
    return state.filters.programArea;
  }

  @Selector([CollectionsState])
  static getCollectedTypeFilters(state: CollectionsStateModel): string[] {
    return state.filters.collectedType;
  }

  @Selector([CollectionsState])
  static getDataTypeFilters(state: CollectionsStateModel): string[] {
    return state.filters.dataType;
  }

  @Selector([CollectionsState])
  static getDiseaseFilters(state: CollectionsStateModel): string[] {
    return state.filters.disease;
  }

  @Selector([CollectionsState])
  static getGradeLevelsFilters(state: CollectionsStateModel): string[] {
    return state.filters.gradeLevels;
  }

  @Selector([CollectionsState])
  static getIssueFilters(state: CollectionsStateModel): string[] {
    return state.filters.issue;
  }

  @Selector([CollectionsState])
  static getReviewsStateFilters(state: CollectionsStateModel): string[] {
    return state.filters.reviewsState;
  }

  @Selector([CollectionsState])
  static getSchoolTypeFilters(state: CollectionsStateModel): string[] {
    return state.filters.schoolType;
  }

  @Selector([CollectionsState])
  static getStudyDesignFilters(state: CollectionsStateModel): string[] {
    return state.filters.studyDesign;
  }

  @Selector([CollectionsState])
  static getVolumeFilters(state: CollectionsStateModel): string[] {
    return state.filters.volume;
  }

  @Selector([CollectionsState])
  static getAllFiltersOptions(state: CollectionsStateModel): CollectionsFilters {
    return state.filtersOptions;
  }
}
