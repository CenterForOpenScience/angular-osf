import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, Observable, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { CitationTypes } from '@shared/enums';
import { CitationsService } from '@shared/services/citations.service';

import { GetCitationStyles, GetDefaultCitations, GetStyledCitation, UpdateCustomCitation } from './citations.actions';
import { CitationsStateModel } from './citations.model';

const CITATIONS_DEFAULTS: CitationsStateModel = {
  defaultCitations: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  citationStyles: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  styledCitation: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  customCitation: {
    data: '',
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};

@State<CitationsStateModel>({
  name: 'citations',
  defaults: CITATIONS_DEFAULTS,
})
@Injectable()
export class CitationsState {
  citationsService = inject(CitationsService);

  @Action(GetDefaultCitations)
  getDefaultCitation(ctx: StateContext<CitationsStateModel>, action: GetDefaultCitations) {
    const state = ctx.getState();
    ctx.patchState({
      defaultCitations: {
        ...state.defaultCitations,
        isLoading: true,
        error: null,
      },
    });

    const citationRequests = Object.values(CitationTypes).map((citationType) =>
      this.citationsService.fetchDefaultCitation(action.resourceType, action.resourceId, citationType)
    );

    return forkJoin(citationRequests).pipe(
      tap((citations) => {
        ctx.patchState({
          defaultCitations: {
            data: citations,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'defaultCitations', error))
    );
  }

  @Action(GetCitationStyles)
  getCitationStyles(ctx: StateContext<CitationsStateModel>, action: GetCitationStyles) {
    const state = ctx.getState();
    ctx.patchState({
      citationStyles: {
        ...state.citationStyles,
        isLoading: true,
        error: null,
      },
    });

    return this.citationsService.fetchCitationStyles(action.searchQuery).pipe(
      tap((citationStyles) => {
        ctx.patchState({
          citationStyles: {
            data: citationStyles,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'citationStyles', error))
    );
  }

  @Action(UpdateCustomCitation)
  updateCustomCitation(ctx: StateContext<CitationsStateModel>, action: UpdateCustomCitation): Observable<unknown> {
    const state = ctx.getState();
    ctx.patchState({
      customCitation: {
        ...state.customCitation,
        isSubmitting: true,
        error: null,
      },
    });

    return this.citationsService.updateCustomCitation(action.payload).pipe(
      tap(() => {
        ctx.patchState({
          customCitation: {
            ...state.customCitation,
            data: action.payload.citationText,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'customCitation', error))
    );
  }

  @Action(GetStyledCitation)
  getStyledCitation(ctx: StateContext<CitationsStateModel>, action: GetStyledCitation) {
    const state = ctx.getState();
    ctx.patchState({
      styledCitation: {
        ...state.styledCitation,
        isLoading: true,
        error: null,
      },
    });

    return this.citationsService.fetchStyledCitation(action.resourceType, action.resourceId, action.citationStyle).pipe(
      tap((styledCitation) => {
        ctx.patchState({
          styledCitation: {
            data: styledCitation,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'styledCitation', error))
    );
  }
}
