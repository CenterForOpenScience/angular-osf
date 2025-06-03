import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { CollectionsService } from '../services';

import {
  AddProjectToBookmarks,
  ClearCollections,
  GetBookmarksCollectionId,
  RemoveProjectFromBookmarks,
  SetCollectedTypeFilters,
  SetDataTypeFilters,
  SetDiseaseFilters,
  SetGradeLevelsFilters,
  SetIssueFilters,
  SetProgramAreaFilters,
  SetReviewsStateFilters,
  SetSchoolTypeFilters,
  SetStatusFilters,
  SetStudyDesignFilters,
  SetVolumeFilters,
} from './collections.actions';
import { CollectionsStateModel } from './collections.model';

const FILTERS_DEFAULTS = {
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

const COLLECTIONS_DEFAULTS: CollectionsStateModel = {
  bookmarksId: {
    data: '',
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  filters: FILTERS_DEFAULTS,
  filtersOptions: FILTERS_DEFAULTS,
};

@State<CollectionsStateModel>({
  name: 'collections',
  defaults: COLLECTIONS_DEFAULTS,
})
@Injectable()
export class CollectionsState {
  constructor(private collectionsService: CollectionsService) {}

  @Action(GetBookmarksCollectionId)
  getBookmarksCollectionId(ctx: StateContext<CollectionsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isLoading: true,
      },
    });

    return this.collectionsService.getBookmarksCollectionId().pipe(
      tap((res) => {
        ctx.patchState({
          bookmarksId: {
            data: res,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'bookmarksId', error))
    );
  }

  @Action(AddProjectToBookmarks)
  addProjectToBookmarks(ctx: StateContext<CollectionsStateModel>, action: AddProjectToBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isSubmitting: true,
      },
    });

    return this.collectionsService.addProjectToBookmarks(action.bookmarksId, action.projectId).pipe(
      tap(() => {
        ctx.patchState({
          bookmarksId: {
            ...state.bookmarksId,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'bookmarksId', error))
    );
  }

  @Action(RemoveProjectFromBookmarks)
  removeProjectFromBookmarks(ctx: StateContext<CollectionsStateModel>, action: RemoveProjectFromBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isSubmitting: true,
      },
    });

    return this.collectionsService.removeProjectFromBookmarks(action.bookmarksId, action.projectId).pipe(
      tap(() => {
        ctx.patchState({
          bookmarksId: {
            ...state.bookmarksId,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'bookmarksId', error))
    );
  }

  @Action(ClearCollections)
  clearCollections(ctx: StateContext<CollectionsStateModel>) {
    ctx.patchState(COLLECTIONS_DEFAULTS);
  }

  // Filter Actions
  @Action(SetProgramAreaFilters)
  setProgramAreaFilters(ctx: StateContext<CollectionsStateModel>, action: SetProgramAreaFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        programArea: action.programAreaFilters,
      },
    });
  }

  @Action(SetCollectedTypeFilters)
  setCollectedTypesFilters(ctx: StateContext<CollectionsStateModel>, action: SetCollectedTypeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        collectedType: action.collectedTypeFilters,
      },
    });
  }

  @Action(SetStatusFilters)
  setStatusFilters(ctx: StateContext<CollectionsStateModel>, action: SetStatusFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        status: action.statusFilters,
      },
    });
  }

  @Action(SetDataTypeFilters)
  setDataTypeFilters(ctx: StateContext<CollectionsStateModel>, action: SetDataTypeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        dataType: action.dataTypeFilters,
      },
    });
  }

  @Action(SetDiseaseFilters)
  setDiseaseFilters(ctx: StateContext<CollectionsStateModel>, action: SetDiseaseFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        disease: action.diseaseFilters,
      },
    });
  }

  @Action(SetGradeLevelsFilters)
  setGradeLevelsFilters(ctx: StateContext<CollectionsStateModel>, action: SetGradeLevelsFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        gradeLevels: action.gradeLevelsFilters,
      },
    });
  }

  @Action(SetIssueFilters)
  setIssueFilters(ctx: StateContext<CollectionsStateModel>, action: SetIssueFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        issue: action.issueFilters,
      },
    });
  }

  @Action(SetReviewsStateFilters)
  setReviewsStateFilters(ctx: StateContext<CollectionsStateModel>, action: SetReviewsStateFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        reviewsState: action.reviewsStateFilters,
      },
    });
  }

  @Action(SetSchoolTypeFilters)
  setSchoolTypeFilters(ctx: StateContext<CollectionsStateModel>, action: SetSchoolTypeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        schoolType: action.schoolTypeFilters,
      },
    });
  }

  @Action(SetStudyDesignFilters)
  setStudyDesignFilters(ctx: StateContext<CollectionsStateModel>, action: SetStudyDesignFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        studyDesign: action.studyDesignFilters,
      },
    });
  }

  @Action(SetVolumeFilters)
  setVolumeFilters(ctx: StateContext<CollectionsStateModel>, action: SetVolumeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        volume: action.volumeFilters,
      },
    });
  }

  private handleError(ctx: StateContext<CollectionsStateModel>, section: keyof CollectionsStateModel, error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        isSubmitting: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
