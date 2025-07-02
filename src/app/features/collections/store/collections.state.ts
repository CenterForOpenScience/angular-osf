import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { CollectionsService } from '../services';

import {
  AddProjectToBookmarks,
  ClearCollections,
  ClearCollectionSubmissions,
  GetBookmarksCollectionId,
  GetCollectionDetails,
  GetCollectionProvider,
  GetCollectionSubmissions,
  RemoveProjectFromBookmarks,
  SetAllFilters,
  SetCollectedTypeFilters,
  SetDataTypeFilters,
  SetDiseaseFilters,
  SetGradeLevelsFilters,
  SetIssueFilters,
  SetPageNumber,
  SetProgramAreaFilters,
  SetSchoolTypeFilters,
  SetSearchValue,
  SetSortBy,
  SetStatusFilters,
  SetStudyDesignFilters,
  SetTotalSubmissions,
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
  totalSubmissions: 0,
  sortBy: '',
  searchText: '',
  page: '1',
};

@State<CollectionsStateModel>({
  name: 'collections',
  defaults: COLLECTIONS_DEFAULTS,
})
@Injectable()
export class CollectionsState {
  constructor(private collectionsService: CollectionsService) {}

  @Action(GetCollectionProvider)
  getCollectionProvider(ctx: StateContext<CollectionsStateModel>, action: GetCollectionProvider) {
    const state = ctx.getState();
    ctx.patchState({
      collectionProvider: {
        ...state.collectionProvider,
        isLoading: true,
      },
    });

    return this.collectionsService.getCollectionProvider(action.collectionName).pipe(
      tap((res) => {
        ctx.patchState({
          collectionProvider: {
            data: res,
            isLoading: false,
            error: null,
          },
        });
      })
    );
  }

  @Action(GetCollectionDetails)
  getCollectionDetails(ctx: StateContext<CollectionsStateModel>, action: GetCollectionDetails) {
    const state = ctx.getState();

    ctx.patchState({
      collectionDetails: {
        ...state.collectionDetails,
        isLoading: true,
      },
    });

    return this.collectionsService.getCollectionDetails(action.collectionId).pipe(
      tap((res) => {
        ctx.patchState({
          collectionDetails: {
            data: res,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });

        ctx.patchState({
          filtersOptions: {
            ...state.filtersOptions,
            ...res.filters,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'collectionDetails', error))
    );
  }

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

  @Action(ClearCollectionSubmissions)
  clearCollectionSubmissions(ctx: StateContext<CollectionsStateModel>) {
    ctx.patchState({
      collectionSubmissions: {
        data: [],
        isLoading: false,
        isSubmitting: false,
        error: null,
      },
    });
  }

  @Action(SetAllFilters)
  setAllFilters(ctx: StateContext<CollectionsStateModel>, action: SetAllFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        ...action.filters,
      },
      page: '1',
    });
  }

  @Action(SetProgramAreaFilters)
  setProgramAreaFilters(ctx: StateContext<CollectionsStateModel>, action: SetProgramAreaFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        programArea: action.programAreaFilters,
      },
    });
  }

  @Action(SetCollectedTypeFilters)
  setCollectedTypesFilters(ctx: StateContext<CollectionsStateModel>, action: SetCollectedTypeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        collectedType: action.collectedTypeFilters,
      },
    });
  }

  @Action(SetStatusFilters)
  setStatusFilters(ctx: StateContext<CollectionsStateModel>, action: SetStatusFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        status: action.statusFilters,
      },
    });
  }

  @Action(SetDataTypeFilters)
  setDataTypeFilters(ctx: StateContext<CollectionsStateModel>, action: SetDataTypeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        dataType: action.dataTypeFilters,
      },
    });
  }

  @Action(SetDiseaseFilters)
  setDiseaseFilters(ctx: StateContext<CollectionsStateModel>, action: SetDiseaseFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        disease: action.diseaseFilters,
      },
    });
  }

  @Action(SetGradeLevelsFilters)
  setGradeLevelsFilters(ctx: StateContext<CollectionsStateModel>, action: SetGradeLevelsFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        gradeLevels: action.gradeLevelsFilters,
      },
    });
  }

  @Action(SetIssueFilters)
  setIssueFilters(ctx: StateContext<CollectionsStateModel>, action: SetIssueFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        issue: action.issueFilters,
      },
    });
  }

  @Action(SetSchoolTypeFilters)
  setSchoolTypeFilters(ctx: StateContext<CollectionsStateModel>, action: SetSchoolTypeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        schoolType: action.schoolTypeFilters,
      },
    });
  }

  @Action(SetStudyDesignFilters)
  setStudyDesignFilters(ctx: StateContext<CollectionsStateModel>, action: SetStudyDesignFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        studyDesign: action.studyDesignFilters,
      },
    });
  }

  @Action(SetVolumeFilters)
  setVolumeFilters(ctx: StateContext<CollectionsStateModel>, action: SetVolumeFilters) {
    const state = ctx.getState();
    ctx.patchState({
      currentFilters: {
        ...state.currentFilters,
        volume: action.volumeFilters,
      },
    });
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<CollectionsStateModel>, action: SetSortBy) {
    ctx.patchState({
      sortBy: action.sortValue,
    });
  }

  @Action(SetSearchValue)
  setSearchValue(ctx: StateContext<CollectionsStateModel>, action: SetSearchValue) {
    ctx.patchState({
      searchText: action.searchValue,
      page: '1',
    });
  }

  @Action(SetPageNumber)
  setPageNumber(ctx: StateContext<CollectionsStateModel>, action: SetPageNumber) {
    ctx.patchState({
      page: action.page,
    });
  }

  @Action(SetTotalSubmissions)
  setTotalSubmissions(ctx: StateContext<CollectionsStateModel>, action: SetTotalSubmissions) {
    ctx.patchState({
      totalSubmissions: action.totalCount,
    });
  }

  @Action(GetCollectionSubmissions)
  getCollectionSubmission(ctx: StateContext<CollectionsStateModel>, action: GetCollectionSubmissions) {
    const state = ctx.getState();
    ctx.patchState({
      collectionSubmissions: {
        ...state.collectionSubmissions,
        isLoading: true,
      },
    });

    return this.collectionsService
      .getCollectionSubmissions(action.providerId, action.searchText, action.activeFilters, action.page, action.sort)
      .pipe(
        tap((res) => {
          ctx.patchState({
            collectionSubmissions: {
              data: res,
              isLoading: false,
              error: null,
            },
          });
        }),
        catchError((error) => this.handleError(ctx, 'collectionSubmissions', error))
      );
  }

  private handleError(ctx: StateContext<CollectionsStateModel>, section: keyof CollectionsStateModel, error: Error) {
    const state = ctx.getState();
    if (section !== 'sortBy' && section !== 'searchText' && section !== 'page' && section !== 'totalSubmissions') {
      ctx.patchState({
        [section]: {
          ...state[section],
          isLoading: false,
          isSubmitting: false,
          error: error.message,
        },
      });
    }

    return throwError(() => error);
  }
}
