import { StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers/state-error.handler';

import { RegistrationContributorsService } from '../../services/registration-contributors.service';
import { AddContributor, DeleteContributor, FetchContributors, UpdateContributor } from '../registries.actions';
import { RegistriesStateModel } from '../registries.model';

@Injectable()
export class RegistrationContributorsHandlers {
  contributorsService = inject(RegistrationContributorsService);

  fetchContributors(ctx: StateContext<RegistriesStateModel>, action: FetchContributors) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.getContributors(action.draftId).pipe(
      tap((contributors) => {
        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data: contributors,
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'contributorsList', error))
    );
  }

  addContributor(ctx: StateContext<RegistriesStateModel>, action: AddContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.addContributor(action.draftId, action.contributor).pipe(
      tap((contributor) => {
        const currentState = ctx.getState();

        ctx.patchState({
          contributorsList: {
            ...currentState.contributorsList,
            data: [...currentState.contributorsList.data, contributor],
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'contributorsList', error))
    );
  }

  updateContributor(ctx: StateContext<RegistriesStateModel>, action: UpdateContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.updateContributor(action.draftId, action.contributor).pipe(
      tap((updatedContributor) => {
        const currentState = ctx.getState();

        ctx.patchState({
          contributorsList: {
            ...currentState.contributorsList,
            data: currentState.contributorsList.data.map((contributor) =>
              contributor.id === updatedContributor.id ? updatedContributor : contributor
            ),
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'contributorsList', error))
    );
  }

  deleteContributor(ctx: StateContext<RegistriesStateModel>, action: DeleteContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.deleteContributor(action.draftId, action.contributorId).pipe(
      tap(() => {
        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data: state.contributorsList.data.filter((contributor) => contributor.userId !== action.contributorId),
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'contributorsList', error))
    );
  }
}
