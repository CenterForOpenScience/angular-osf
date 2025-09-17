import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';

import { RegistryLinksService } from '../../services/registry-links.service';

import { GetLinkedNodes, GetLinkedRegistrations } from './registry-links.actions';
import { REGISTRY_LINKS_STATE_DEFAULTS, RegistryLinksStateModel } from './registry-links.model';

@State<RegistryLinksStateModel>({
  name: 'registryLinks',
  defaults: REGISTRY_LINKS_STATE_DEFAULTS,
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
}
