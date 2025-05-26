import { Action, State, StateContext } from '@ngxs/store';

import { Observable, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { AddonResponse } from '../models';
import { AddonsService } from '../services';

import {
  CreateAuthorizedAddon,
  DeleteAuthorizedAddon,
  GetAddonsUserReference,
  GetAuthorizedCitationAddons,
  GetAuthorizedStorageAddons,
  GetCitationAddons,
  GetStorageAddons,
  UpdateAuthorizedAddon,
} from './addons.actions';
import { AddonsStateModel } from './addons.models';

@State<AddonsStateModel>({
  name: 'addons',
  defaults: {
    storageAddons: [],
    citationAddons: [],
    authorizedStorageAddons: [],
    authorizedCitationAddons: [],
    addonsUserReference: [],
    createdUpdatedAuthorizedAddon: null,
  },
})
@Injectable()
export class AddonsState {
  addonsService = inject(AddonsService);

  @Action(GetStorageAddons)
  getStorageAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddons('storage').pipe(
      tap((addons) => {
        ctx.patchState({ storageAddons: addons });
      })
    );
  }

  @Action(GetCitationAddons)
  getCitationAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddons('citation').pipe(
      tap((addons) => {
        ctx.patchState({ citationAddons: addons });
      })
    );
  }

  @Action(GetAuthorizedStorageAddons)
  getAuthorizedStorageAddons(ctx: StateContext<AddonsStateModel>, action: GetAuthorizedStorageAddons) {
    return this.addonsService.getAuthorizedAddons('storage', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({ authorizedStorageAddons: addons });
      })
    );
  }

  @Action(GetAuthorizedCitationAddons)
  getAuthorizedCitationAddons(ctx: StateContext<AddonsStateModel>, action: GetAuthorizedCitationAddons) {
    return this.addonsService.getAuthorizedAddons('citation', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({ authorizedCitationAddons: addons });
      })
    );
  }

  @Action(CreateAuthorizedAddon)
  createAuthorizedAddon(ctx: StateContext<AddonsStateModel>, action: CreateAuthorizedAddon): Observable<AddonResponse> {
    return this.addonsService.createAuthorizedAddon(action.payload, action.addonType).pipe(
      tap((addon) => {
        ctx.patchState({ createdUpdatedAuthorizedAddon: addon });
        const referenceId = ctx.getState().addonsUserReference[0].id;
        return action.addonType === 'storage'
          ? ctx.dispatch(new GetAuthorizedStorageAddons(referenceId))
          : ctx.dispatch(new GetAuthorizedCitationAddons(referenceId));
      })
    );
  }

  @Action(UpdateAuthorizedAddon)
  updateAuthorizedAddon(ctx: StateContext<AddonsStateModel>, action: UpdateAuthorizedAddon): Observable<AddonResponse> {
    return this.addonsService.updateAuthorizedAddon(action.payload, action.addonType, action.addonId).pipe(
      tap((addon) => {
        ctx.patchState({ createdUpdatedAuthorizedAddon: addon });
        const referenceId = ctx.getState().addonsUserReference[0].id;
        return action.addonType === 'storage'
          ? ctx.dispatch(new GetAuthorizedStorageAddons(referenceId))
          : ctx.dispatch(new GetAuthorizedCitationAddons(referenceId));
      })
    );
  }

  @Action(GetAddonsUserReference)
  getAddonsUserReference(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddonsUserReference().pipe(
      tap((userReference) => {
        ctx.patchState({ addonsUserReference: userReference });
      })
    );
  }

  @Action(DeleteAuthorizedAddon)
  deleteAuthorizedAddon(ctx: StateContext<AddonsStateModel>, action: DeleteAuthorizedAddon) {
    return this.addonsService.deleteAuthorizedAddon(action.payload, action.addonType).pipe(
      switchMap(() => {
        const referenceId = ctx.getState().addonsUserReference[0].id;
        return action.addonType === 'storage'
          ? ctx.dispatch(new GetAuthorizedStorageAddons(referenceId))
          : ctx.dispatch(new GetAuthorizedCitationAddons(referenceId));
      })
    );
  }
}
