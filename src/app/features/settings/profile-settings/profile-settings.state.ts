import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserSelectors } from '@core/store/user/user.selectors';
import { mapNameToDto } from '@osf/features/settings/profile-settings/name/name.entities';
import {
  SetupProfileSettings,
  UpdateProfileSettingsEducation,
  UpdateProfileSettingsEmployment,
  UpdateProfileSettingsSocialLinks,
  UpdateProfileSettingsUser,
} from '@osf/features/settings/profile-settings/profile-settings.actions';
import { ProfileSettingsApiService } from '@osf/features/settings/profile-settings/profile-settings.api.service';
import {
  PROFILE_SETTINGS_INITIAL_STATE,
  PROFILE_SETTINGS_STATE_NAME,
  ProfileSettingsStateModel,
} from '@osf/features/settings/profile-settings/profile-settings.entities';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';
import { removeNullable } from '@shared/utils/remove-nullable.const';

@State<ProfileSettingsStateModel>({
  name: PROFILE_SETTINGS_STATE_NAME,
  defaults: PROFILE_SETTINGS_INITIAL_STATE,
})
@Injectable()
export class ProfileSettingsState {
  readonly #store = inject(Store);
  readonly #profileSettingsService = inject(ProfileSettingsApiService);

  @Action(SetupProfileSettings)
  setupProfileSettings(ctx: StateContext<ProfileSettingsStateModel>): void {
    const state = ctx.getState();
    const profileSettings = this.#store.selectSnapshot(UserSelectors.getProfileSettings);

    ctx.patchState({
      ...state,
      ...profileSettings,
    });
  }

  @Action(UpdateProfileSettingsEmployment)
  updateProfileSettingsEmployment(
    ctx: StateContext<ProfileSettingsStateModel>,
    { payload }: UpdateProfileSettingsEmployment
  ) {
    const state = ctx.getState();
    const userId = state.user.id;

    if (!userId) {
      return;
    }

    const withoutNulls = payload.employment.map((item) => {
      return removeNullable(item);
    });

    return this.#profileSettingsService.patchUserSettings(userId, 'employment', withoutNulls).pipe(
      tap((response) => {
        ctx.patchState({
          ...state,
          employment: response.data.attributes.employment,
        });
      })
    );
  }

  @Action(UpdateProfileSettingsEducation)
  updateProfileSettingsEducation(
    ctx: StateContext<ProfileSettingsStateModel>,
    { payload }: UpdateProfileSettingsEducation
  ) {
    const state = ctx.getState();
    const userId = state.user.id;

    if (!userId) {
      return;
    }

    const withoutNulls = payload.education.map((item) => {
      return removeNullable(item);
    });

    return this.#profileSettingsService.patchUserSettings(userId, 'education', withoutNulls).pipe(
      tap((response) => {
        ctx.patchState({
          ...state,
          education: response.data.attributes.education,
        });
      })
    );
  }

  @Action(UpdateProfileSettingsUser)
  updateProfileSettingsUser(ctx: StateContext<ProfileSettingsStateModel>, { payload }: UpdateProfileSettingsUser) {
    const state = ctx.getState();
    const userId = state.user.id;

    if (!userId) {
      return;
    }

    const withoutNulls = mapNameToDto(removeNullable(payload.user));

    return this.#profileSettingsService.patchUserSettings(userId, 'user', withoutNulls).pipe(
      tap((response) => {
        ctx.patchState({
          ...state,
          user: response.data.attributes,
        });
      })
    );
  }

  @Action(UpdateProfileSettingsSocialLinks)
  updateProfileSettingsSocialLinks(
    ctx: StateContext<ProfileSettingsStateModel>,
    { payload }: UpdateProfileSettingsSocialLinks
  ) {
    const state = ctx.getState();
    const userId = state.user.id;

    if (!userId) {
      return;
    }

    let social = {} as Partial<Social>;

    payload.socialLinks.forEach((item) => {
      social = {
        ...social,
        ...item,
      };
    });

    return this.#profileSettingsService.patchUserSettings(userId, 'social', social).pipe(
      tap((response) => {
        ctx.patchState({
          ...state,
          social: response.data.attributes.social,
        });
      })
    );
  }
}
