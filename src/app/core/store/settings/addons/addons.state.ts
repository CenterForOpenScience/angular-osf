import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddonsService } from '@osf/features/settings/addons/addons.service';
import { GetAddons } from './addons.actions';
import { tap } from 'rxjs';
import { AddonsStateModel } from './addons.models';
import { Addon } from '@shared/entities/addons.entities';

@State<AddonsStateModel>({
  name: 'addons',
  defaults: {
    addons: [],
  },
})
@Injectable()
export class AddonsState {
  addonsService = inject(AddonsService);

  @Selector()
  static getAddons(state: AddonsStateModel): Addon[] {
    return state.addons;
  }

  @Action(GetAddons)
  getAddons(ctx: StateContext<AddonsStateModel>) {
    return this.addonsService.getAddons().pipe(
      tap((addons) => {
        console.log(addons);
        ctx.patchState({ addons });
      }),
    );
  }
}
