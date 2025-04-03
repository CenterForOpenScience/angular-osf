import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddonsService } from '@osf/features/settings/addons/addons.service';
import { GetStorageAddons } from './addons.actions';
import { tap } from 'rxjs';
import { AddonsStateModel } from './addons.models';
import { Addon } from '@shared/entities/addons.entities';

@State<AddonsStateModel>({
  name: 'addons',
  defaults: {
    storageAddons: [],
    citationAddons: [],
  },
})
@Injectable()
export class AddonsState {
  addonsService = inject(AddonsService);

  @Selector()
  static getStorageAddons(state: AddonsStateModel): Addon[] {
    return state.storageAddons;
  }

  @Selector()
  static getCitationAddons(state: AddonsStateModel): Addon[] {
    return state.citationAddons;
  }

  @Action(GetStorageAddons)
  getStorageAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddons('storage').pipe(
      tap((addons) => {
        console.log(addons);
        ctx.patchState({ storageAddons: addons });
      }),
    );
  }

  @Action(GetStorageAddons)
  getCitationAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddons('citation').pipe(
      tap((addons) => {
        console.log(addons);
        ctx.patchState({ citationAddons: addons });
      }),
    );
  }
}
