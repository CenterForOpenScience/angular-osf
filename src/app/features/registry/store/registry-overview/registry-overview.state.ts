import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { SetCurrentProvider } from '@osf/core/store/provider/provider.actions';
import { SetUserAsModerator } from '@osf/core/store/user';
import { handleSectionError } from '@osf/shared/helpers';

import { RegistryOverviewService } from '../../services';

import {
  ClearRegistryOverview,
  GetRegistryById,
  GetRegistryInstitutions,
  GetRegistryReviewActions,
  GetRegistrySubjects,
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
      tap({
        next: (registryOverview) => {
          if (registryOverview?.currentUserIsModerator) {
            ctx.dispatch(new SetUserAsModerator());
          }
          if (registryOverview?.provider) {
            ctx.dispatch(new SetCurrentProvider(registryOverview.provider));
          }
          ctx.patchState({
            registry: {
              data: registryOverview,
              isLoading: false,
              error: null,
            },
          });
          if (registryOverview?.registrationSchemaLink && registryOverview?.questions && !action.isComponentPage) {
            ctx.dispatch(new GetSchemaBlocks(registryOverview.registrationSchemaLink, registryOverview.questions));
          }
        },
      }),
      catchError((error) => handleSectionError(ctx, 'registry', error))
    );
  }

  @Action(GetRegistrySubjects)
  getRegistrySubjects(ctx: StateContext<RegistryOverviewStateModel>, action: GetRegistrySubjects) {
    const state = ctx.getState();
    ctx.patchState({
      subjects: {
        ...state.subjects,
        isLoading: true,
      },
    });

    return this.registryOverviewService.getSubjects(action.registryId).pipe(
      tap({
        next: (subjects) => {
          ctx.patchState({
            subjects: {
              data: subjects,
              isLoading: false,
              error: null,
            },
          });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'subjects', error))
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
      tap({
        next: (institutions) => {
          ctx.patchState({
            institutions: {
              data: institutions,
              isLoading: false,
              error: null,
            },
          });
        },
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
      tap({
        next: (schemaBlocks) => {
          ctx.patchState({
            schemaBlocks: {
              data: schemaBlocks,
              isLoading: false,
              error: null,
            },
          });
        },
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
      tap({
        next: (registryOverview) => {
          ctx.patchState({
            registry: {
              data: registryOverview,
              isLoading: false,
              error: null,
            },
          });
          if (registryOverview?.registrationSchemaLink && registryOverview?.questions) {
            ctx.dispatch(new GetSchemaBlocks(registryOverview.registrationSchemaLink, registryOverview.questions));
          }
        },
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
      tap({
        next: (registryOverview) => {
          ctx.patchState({
            registry: {
              data: registryOverview,
              isLoading: false,
              error: null,
            },
          });
          if (registryOverview?.registrationSchemaLink && registryOverview?.questions) {
            ctx.dispatch(new GetSchemaBlocks(registryOverview.registrationSchemaLink, registryOverview.questions));
          }
        },
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
