import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';

import { RegistryLinksService } from '../../services/registry-links.service';

import {
  GetBibliographicContributors,
  GetBibliographicContributorsForRegistration,
  GetLinkedNodes,
  GetLinkedRegistrations,
} from './registry-links.actions';
import { RegistryLinksStateModel } from './registry-links.model';

const initialState: RegistryLinksStateModel = {
  linkedNodes: { data: [], isLoading: false, error: null },
  linkedRegistrations: { data: [], isLoading: false, error: null },
  bibliographicContributors: { data: [], isLoading: false, error: null },
  bibliographicContributorsForRegistration: { data: [], isLoading: false, error: null },
};

@State<RegistryLinksStateModel>({
  name: 'registryLinks',
  defaults: initialState,
})
@Injectable()
export class RegistryLinksState {
  private readonly registryLinksService = inject(RegistryLinksService);

  @Action(GetLinkedNodes)
  getLinkedNodes(ctx: StateContext<RegistryLinksStateModel>, action: GetLinkedNodes) {
    const state = ctx.getState();
    ctx.patchState({
      linkedNodes: { ...state.linkedNodes, isLoading: true, error: null },
    });

    return this.registryLinksService.getLinkedNodes(action.registryId, action.page, action.pageSize).pipe(
      tap((response) => {
        ctx.patchState({
          linkedNodes: {
            data: response.data,
            isLoading: false,
            error: null,
            meta: response.meta,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'linkedNodes', error))
    );
  }

  @Action(GetLinkedRegistrations)
  getLinkedRegistrations(ctx: StateContext<RegistryLinksStateModel>, action: GetLinkedRegistrations) {
    const state = ctx.getState();
    ctx.patchState({
      linkedRegistrations: { ...state.linkedRegistrations, isLoading: true, error: null },
    });

    return this.registryLinksService.getLinkedRegistrations(action.registryId, action.page, action.pageSize).pipe(
      tap((response) => {
        ctx.patchState({
          linkedRegistrations: {
            data: response.data,
            isLoading: false,
            error: null,
            meta: response.meta,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'linkedRegistrations', error))
    );
  }

  @Action(GetBibliographicContributors)
  getBibliographicContributors(ctx: StateContext<RegistryLinksStateModel>, action: GetBibliographicContributors) {
    const state = ctx.getState();
    ctx.patchState({
      bibliographicContributors: {
        ...state.bibliographicContributors,
        isLoading: true,
        error: null,
        nodeId: action.nodeId,
      },
    });

    return this.registryLinksService.getBibliographicContributors(action.nodeId).pipe(
      tap((contributors) => {
        ctx.patchState({
          bibliographicContributors: {
            data: contributors,
            isLoading: false,
            error: null,
            nodeId: action.nodeId,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'bibliographicContributors', error))
    );
  }

  @Action(GetBibliographicContributorsForRegistration)
  getBibliographicContributorsForRegistration(
    ctx: StateContext<RegistryLinksStateModel>,
    action: GetBibliographicContributorsForRegistration
  ) {
    const state = ctx.getState();
    ctx.patchState({
      bibliographicContributorsForRegistration: {
        ...state.bibliographicContributorsForRegistration,
        isLoading: true,
        error: null,
        registrationId: action.registrationId,
      },
    });

    return this.registryLinksService.getBibliographicContributorsForRegistration(action.registrationId).pipe(
      tap((contributors) => {
        ctx.patchState({
          bibliographicContributorsForRegistration: {
            data: contributors,
            isLoading: false,
            error: null,
            registrationId: action.registrationId,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'bibliographicContributorsForRegistration', error))
    );
  }
}
