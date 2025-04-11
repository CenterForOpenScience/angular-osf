import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { AddonsService } from '@osf/features/settings/addons/addons.service';
import {
  GetCitationAddons,
  GetStorageAddons,
  GetAuthorizedStorageAddons,
  GetAuthorizedCitationAddons,
} from './addons.actions';
import { tap } from 'rxjs';
import { AddonsStateModel } from './addons.models';

@State<AddonsStateModel>({
  name: 'addons',
  defaults: {
    storageAddons: [],
    citationAddons: [],
    authorizedStorageAddons: [],
    authorizedCitationAddons: [],
  },
})
@Injectable()
export class AddonsState {
  addonsService = inject(AddonsService);

  @Action(GetStorageAddons)
  getStorageAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddons('storage').pipe(
      tap((addons) => {
        console.log('storage', addons);
        ctx.patchState({ storageAddons: addons });
      }),
    );
  }

  @Action(GetCitationAddons)
  getCitationAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddons('citation').pipe(
      tap((addons) => {
        console.log('citation', addons);
        ctx.patchState({ citationAddons: addons });
      }),
    );
  }

  @Action(GetAuthorizedStorageAddons)
  getAuthorizedStorageAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAuthorizedAddons('storage').pipe(
      tap((addons) => {
        console.log('authorized storage', addons);
        ctx.patchState({ authorizedStorageAddons: addons });
      }),
    );
  }

  @Action(GetAuthorizedCitationAddons)
  getAuthorizedCitationAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAuthorizedAddons('citation').pipe(
      tap((addons) => {
        console.log('authorized citation', addons);
        ctx.patchState({ authorizedCitationAddons: addons });
      }),
    );
  }
}
