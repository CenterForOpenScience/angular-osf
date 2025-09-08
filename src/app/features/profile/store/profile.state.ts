import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserService } from '@core/services';
import { handleSectionError } from '@osf/shared/helpers';

import { FetchUserProfile, SetUserProfile } from './profile.actions';
import { PROFILE_STATE_DEFAULTS, ProfileStateModel } from './profile.model';

@Injectable()
@State<ProfileStateModel>({
  name: 'profile',
  defaults: PROFILE_STATE_DEFAULTS,
})
export class ProfileState {
  private userService = inject(UserService);

  @Action(FetchUserProfile)
  fetchUserProfile(ctx: StateContext<ProfileStateModel>, action: FetchUserProfile) {
    ctx.setState(patch({ userProfile: patch({ isLoading: true }) }));

    return this.userService.getUserById(action.userId).pipe(
      tap((user) => {
        ctx.setState(
          patch({
            userProfile: patch({
              data: user,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'userProfile', error))
    );
  }

  @Action(SetUserProfile)
  setUserProfile(ctx: StateContext<ProfileStateModel>, action: SetUserProfile) {
    ctx.setState(
      patch({
        userProfile: patch({
          data: action.userProfile,
          isLoading: false,
        }),
      })
    );
  }
}
