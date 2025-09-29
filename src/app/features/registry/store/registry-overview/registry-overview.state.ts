import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { SetCurrentProvider } from '@core/store/provider';
import { CurrentResourceType } from '@osf/shared/enums';
import { handleSectionError } from '@osf/shared/helpers';

import { RegistryOverviewService } from '../../services';

import {
  ClearRegistryOverview,
  GetRegistryById,
  GetRegistryInstitutions,
  GetRegistryReviewActions,
  GetSchemaBlocks,
  MakePublic,
  SetRegistryCustomCitation,
  SubmitDecision,
  WithdrawRegistration,
} from './registry-overview.actions';
import { REGISTRY_OVERVIEW_DEFAULTS, RegistryOverviewStateModel } from './registry-overview.model';

@Injectable()
@State<RegistryOverviewStateModel>({
  name: 'registryOverview',
  defaults: REGISTRY_OVERVIEW_DEFAULTS,
})
export class RegistryOverviewState {
  private readonly registryOverviewService = inject(RegistryOverviewService);

  @Action(GetRegistryById)
  getRegistryById(ctx: StateContext<RegistryOverviewStateModel>, action: GetRegistryById) {
    const state = ctx.getState();
    ctx.patchState({
      registry: {
        ...state.registry,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getRegistrationById(action.id).pipe(
      tap((response) => {
        const registryOverview = response.registry;

        if (registryOverview?.provider) {
          ctx.dispatch(
            new SetCurrentProvider({
              id: registryOverview.provider.id,
              name: registryOverview.provider.name,
              type: CurrentResourceType.Registrations,
              permissions: registryOverview.provider.permissions,
            })
          );
        }

        ctx.patchState({
          registry: {
            data: registryOverview,
            isLoading: false,
            error: null,
          },
          isAnonymous: response.meta?.anonymous ?? false,
        });

        if (registryOverview?.registrationSchemaLink) {
          ctx.dispatch(new GetSchemaBlocks(registryOverview.registrationSchemaLink));
        }
      }),
      catchError((error) => handleSectionError(ctx, 'registry', error))
    );
  }

  @Action(GetRegistryInstitutions)
  getRegistryInstitutions(ctx: StateContext<RegistryOverviewStateModel>, action: GetRegistryInstitutions) {
    const state = ctx.getState();
    ctx.patchState({
      institutions: {
        ...state.institutions,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getInstitutions(action.registryId).pipe(
      tap((institutions) => {
        ctx.patchState({
          institutions: {
            data: institutions,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'institutions', error))
    );
  }

  @Action(GetSchemaBlocks)
  getSchemaBlocks(ctx: StateContext<RegistryOverviewStateModel>, action: GetSchemaBlocks) {
    const state = ctx.getState();
    ctx.patchState({
      schemaBlocks: {
        ...state.schemaBlocks,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getSchemaBlocks(action.schemaLink).pipe(
      tap((schemaBlocks) => {
        ctx.patchState({
          schemaBlocks: {
            data: schemaBlocks,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'schemaBlocks', error))
    );
  }

  @Action(WithdrawRegistration)
  withdrawRegistration(ctx: StateContext<RegistryOverviewStateModel>, action: WithdrawRegistration) {
    const state = ctx.getState();
    ctx.patchState({
      registry: {
        ...state.registry,
        isLoading: true,
      },
    });

    return this.registryOverviewService.withdrawRegistration(action.registryId, action.justification).pipe(
      tap((registryOverview) => {
        ctx.patchState({
          registry: {
            data: registryOverview,
            isLoading: false,
            error: null,
          },
        });

        if (registryOverview?.registrationSchemaLink) {
          ctx.dispatch(new GetSchemaBlocks(registryOverview.registrationSchemaLink));
        }
      }),
      catchError((error) => handleSectionError(ctx, 'registry', error))
    );
  }

  @Action(MakePublic)
  makePublic(ctx: StateContext<RegistryOverviewStateModel>, action: MakePublic) {
    const state = ctx.getState();
    ctx.patchState({
      registry: {
        ...state.registry,
        isLoading: true,
      },
    });

    return this.registryOverviewService.makePublic(action.registryId).pipe(
      tap((registryOverview) => {
        ctx.patchState({
          registry: {
            data: registryOverview,
            isLoading: false,
            error: null,
          },
        });

        if (registryOverview?.registrationSchemaLink) {
          ctx.dispatch(new GetSchemaBlocks(registryOverview.registrationSchemaLink));
        }
      }),
      catchError((error) => handleSectionError(ctx, 'registry', error))
    );
  }

  @Action(SetRegistryCustomCitation)
  setRegistryCustomCitation(ctx: StateContext<RegistryOverviewStateModel>, action: SetRegistryCustomCitation) {
    const state = ctx.getState();
    ctx.patchState({
      registry: {
        ...state.registry,
        data: {
          ...state.registry.data!,
          customCitation: action.citation,
        },
      },
    });
  }

  @Action(GetRegistryReviewActions)
  getRegistryReviewActions(ctx: StateContext<RegistryOverviewStateModel>, action: GetRegistryReviewActions) {
    ctx.patchState({
      moderationActions: {
        data: [],
        isLoading: true,
        isSubmitting: false,
        error: null,
      },
    });

    return this.registryOverviewService.getRegistryReviewActions(action.registryId).pipe(
      tap((reviewActions) => {
        ctx.patchState({
          moderationActions: {
            data: reviewActions,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'moderationActions', error))
    );
  }

  @Action(SubmitDecision)
  submitDecision(ctx: StateContext<RegistryOverviewStateModel>, action: SubmitDecision) {
    ctx.patchState({
      moderationActions: {
        data: [],
        isLoading: true,
        isSubmitting: true,
        error: null,
      },
    });

    return this.registryOverviewService.submitDecision(action.payload, action.isRevision).pipe(
      tap(() => {
        ctx.patchState({
          moderationActions: {
            data: [],
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'moderationActions', error))
    );
  }

  @Action(ClearRegistryOverview)
  clearRegistryOverview(ctx: StateContext<RegistryOverviewStateModel>) {
    ctx.patchState(REGISTRY_OVERVIEW_DEFAULTS);
  }
}
