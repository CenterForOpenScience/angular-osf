import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, Observable, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { CitationTypes } from '@osf/shared/enums/citation-types.enum';
import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { CitationsService } from '@osf/shared/services/citations.service';

import {
  ClearStyledCitation,
  FetchDefaultProviderCitationStyles,
  GetCitationStyles,
  GetDefaultCitations,
  GetStyledCitation,
  UpdateCustomCitation,
} from './citations.actions';
import { CITATIONS_DEFAULTS, CitationsStateModel } from './citations.model';

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
      this.citationsService.fetchStyledCitationById(action.resourceType, action.resourceId, citationType)
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

  @Action(FetchDefaultProviderCitationStyles)
  fetchDefaultProviderCitationStyles(
    ctx: StateContext<CitationsStateModel>,
    action: FetchDefaultProviderCitationStyles
  ) {
    const state = ctx.getState();
    ctx.patchState({
      defaultCitations: {
        ...state.defaultCitations,
        isLoading: true,
        error: null,
      },
    });

    return this.citationsService.fetchCitationStylesFromProvider(action.resourceType, action.providerId).pipe(
      switchMap((citationStyles) => {
        if (citationStyles.length === 0) {
          return of([[], []]);
        }
        const citationRequests = citationStyles.map((style) =>
          this.citationsService.fetchStyledCitationById(action.resourceType, action.resourceId, style.id)
        );

        return forkJoin([of(citationStyles), forkJoin(citationRequests)]);
      }),
      tap(([citationStyles, citations]) => {
        const citationsWithTitle = citations.map((citation) => {
          return {
            ...citation,
            title: citationStyles.find((style) => style.id === citation.id)!.title,
          };
        });
        ctx.patchState({
          defaultCitations: {
            data: citationsWithTitle,
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

    return this.citationsService
      .fetchStyledCitationById(action.resourceType, action.resourceId, action.citationStyle)
      .pipe(
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

  @Action(ClearStyledCitation)
  clearStyledCitation(ctx: StateContext<CitationsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      styledCitation: {
        ...state.styledCitation,
        data: null,
      },
    });
  }
}
