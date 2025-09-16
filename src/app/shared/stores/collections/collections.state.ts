import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SetCurrentProvider } from '@core/store/provider';
import { CurrentResourceType } from '@osf/shared/enums';
import { handleSectionError } from '@osf/shared/helpers';
import { CollectionsService } from '@osf/shared/services';

import {
  ClearCollections,
  ClearCollectionSubmissions,
  GetCollectionDetails,
  GetCollectionProvider,
  GetProjectSubmissions,
  GetUserCollectionSubmissions,
  SearchCollectionSubmissions,
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
import { COLLECTIONS_DEFAULTS, CollectionsStateModel } from './collections.model';

@State<CollectionsStateModel>({
  name: 'collections',
  defaults: COLLECTIONS_DEFAULTS,
})
@Injectable()
export class CollectionsState {
  collectionsService = inject(CollectionsService);

  @Action(GetCollectionProvider)
  getCollectionProvider(ctx: StateContext<CollectionsStateModel>, action: GetCollectionProvider) {
    const state = ctx.getState();
    ctx.patchState({
      collectionProvider: {
        ...state.collectionProvider,
        isLoading: true,
      },
    });

    const provider = state.collectionProvider.data;

    if (provider?.name === action.collectionName) {
      ctx.dispatch(
        new SetCurrentProvider({
          id: provider.id,
          name: provider.name,
          type: CurrentResourceType.Collections,
          permissions: provider.permissions,
        })
      );

      return of(provider);
    }

    return this.collectionsService.getCollectionProvider(action.collectionName).pipe(
      tap((res) => {
        ctx.patchState({
          collectionProvider: {
            data: res,
            isLoading: false,
            error: null,
          },
        });

        ctx.dispatch(
          new SetCurrentProvider({
            id: res.id,
            name: res.name,
            type: CurrentResourceType.Collections,
            permissions: res.permissions,
          })
        );
      })
    );
  }

  @Action(GetProjectSubmissions)
  getProjectSubmissions(ctx: StateContext<CollectionsStateModel>, action: GetProjectSubmissions) {
    const state = ctx.getState();
    ctx.patchState({
      currentProjectSubmissions: {
        ...state.currentProjectSubmissions,
        isLoading: true,
      },
    });

    return this.collectionsService.fetchProjectCollections(action.projectId).pipe(
      switchMap((res) => {
        const collections = res.filter((collection) => !collection.bookmarks);

        if (!collections.length) {
          return of([]);
        }

        const submissionRequests = collections.map((collection) =>
          this.collectionsService.fetchCurrentSubmission(action.projectId, collection.id)
        );

        return forkJoin(submissionRequests);
      }),
      tap((submissions) => {
        ctx.patchState({
          currentProjectSubmissions: {
            data: submissions,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'currentProjectSubmissions', error))
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
      catchError((error) => handleSectionError(ctx, 'collectionDetails', error))
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

  @Action(SearchCollectionSubmissions)
  searchCollectionSubmissions(ctx: StateContext<CollectionsStateModel>, action: SearchCollectionSubmissions) {
    const state = ctx.getState();
    ctx.patchState({
      collectionSubmissions: {
        ...state.collectionSubmissions,
        isLoading: true,
      },
    });

    return this.collectionsService
      .searchCollectionSubmissions(action.providerId, action.searchText, action.activeFilters, action.page, action.sort)
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
        catchError((error) => handleSectionError(ctx, 'collectionSubmissions', error))
      );
  }

  @Action(GetUserCollectionSubmissions)
  getUserCollectionSubmissions(ctx: StateContext<CollectionsStateModel>, action: GetUserCollectionSubmissions) {
    const state = ctx.getState();
    ctx.patchState({
      userCollectionSubmissions: {
        ...state.userCollectionSubmissions,
        isLoading: true,
      },
    });

    return this.collectionsService.fetchAllUserCollectionSubmissions(action.providerId, action.projectsIds).pipe(
      tap((res) => {
        ctx.patchState({
          userCollectionSubmissions: {
            data: res,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'userCollectionSubmissions', error))
    );
  }
}
