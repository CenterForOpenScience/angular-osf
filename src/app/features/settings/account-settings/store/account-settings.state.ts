import { Action, State, StateContext } from '@ngxs/store';

import { finalize, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SetCurrentUser } from '@core/store/user';
import { InstitutionsService } from '@shared/services';

import { AccountSettingsService } from '../services';

import {
  AddEmail,
  CancelDeactivationRequest,
  DeactivateAccount,
  DeleteEmail,
  DeleteExternalIdentity,
  DeleteUserInstitution,
  DisableTwoFactorAuth,
  EnableTwoFactorAuth,
  GetAccountSettings,
  GetEmails,
  GetExternalIdentities,
  GetRegions,
  GetUserInstitutions,
  MakePrimary,
  SetAccountSettings,
  UpdateAccountSettings,
  UpdateIndexing,
  UpdateRegion,
  VerifyEmail,
} from './account-settings.actions';
import { AccountSettingsStateModel } from './account-settings.model';

@Injectable()
@State<AccountSettingsStateModel>({
  name: 'accountSettings',
  defaults: {
    emails: [],
    emailsLoading: false,
    regions: [],
    externalIdentities: [],
    accountSettings: {
      twoFactorEnabled: false,
      twoFactorConfirmed: false,
      subscribeOsfGeneralEmail: false,
      subscribeOsfHelpEmail: false,
      deactivationRequested: false,
      contactedDeactivation: false,
      secret: '',
    },
    userInstitutions: [],
  },
})
export class AccountSettingsState {
  private readonly accountSettingsService = inject(AccountSettingsService);
  private readonly institutionsService = inject(InstitutionsService);

  @Action(GetEmails)
  getEmails(ctx: StateContext<AccountSettingsStateModel>) {
    ctx.patchState({ emailsLoading: true });

    return this.accountSettingsService.getEmails().pipe(
      tap({
        next: (emails) => {
          ctx.patchState({
            emails: emails,
          });
        },
      }),
      finalize(() => ctx.patchState({ emailsLoading: false }))
    );
  }

  @Action(AddEmail)
  addEmail(ctx: StateContext<AccountSettingsStateModel>, action: AddEmail) {
    return this.accountSettingsService.addEmail(action.email).pipe(
      tap((email) => {
        if (email.emailAddress && !email.confirmed) {
          ctx.dispatch(GetEmails);
        }
      })
    );
  }

  @Action(DeleteEmail)
  deleteEmail(ctx: StateContext<AccountSettingsStateModel>, action: DeleteEmail) {
    return this.accountSettingsService.deleteEmail(action.email).pipe(
      tap(() => {
        ctx.dispatch(GetEmails);
      })
    );
  }

  @Action(VerifyEmail)
  verifyEmail(ctx: StateContext<AccountSettingsStateModel>, action: VerifyEmail) {
    return this.accountSettingsService.verifyEmail(action.userId, action.emailId).pipe(
      tap((email) => {
        if (email.verified) {
          ctx.dispatch(GetEmails);
        }
      })
    );
  }

  @Action(MakePrimary)
  makePrimary(ctx: StateContext<AccountSettingsStateModel>, action: MakePrimary) {
    return this.accountSettingsService.makePrimary(action.emailId).pipe(
      tap((email) => {
        if (email.verified) {
          ctx.dispatch(GetEmails);
        }
      })
    );
  }

  @Action(GetRegions)
  getRegions(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.getRegions().pipe(
      tap({
        next: (regions) => ctx.patchState({ regions: regions }),
      })
    );
  }

  @Action(UpdateRegion)
  updateRegion(ctx: StateContext<AccountSettingsStateModel>, action: UpdateRegion) {
    return this.accountSettingsService.updateLocation(action.regionId).pipe(
      tap({
        next: (user) => {
          ctx.dispatch(new SetCurrentUser(user));
        },
      })
    );
  }

  @Action(UpdateIndexing)
  updateIndexing(ctx: StateContext<AccountSettingsStateModel>, action: UpdateIndexing) {
    return this.accountSettingsService.updateIndexing(action.allowIndexing).pipe(
      tap({
        next: (user) => {
          ctx.dispatch(new SetCurrentUser(user));
        },
      })
    );
  }

  @Action(GetExternalIdentities)
  getExternalIdentities(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.getExternalIdentities().pipe(
      tap({
        next: (identities) => ctx.patchState({ externalIdentities: identities }),
      })
    );
  }

  @Action(DeleteExternalIdentity)
  deleteExternalIdentity(ctx: StateContext<AccountSettingsStateModel>, action: DeleteExternalIdentity) {
    return this.accountSettingsService.deleteExternalIdentity(action.externalId).pipe(
      tap(() => {
        ctx.dispatch(GetExternalIdentities);
      })
    );
  }

  @Action(GetUserInstitutions)
  getUserInstitutions(ctx: StateContext<AccountSettingsStateModel>) {
    return this.institutionsService
      .getUserInstitutions()
      .pipe(tap((userInstitutions) => ctx.patchState({ userInstitutions })));
  }

  @Action(DeleteUserInstitution)
  deleteUserInstitution(ctx: StateContext<AccountSettingsStateModel>, action: DeleteUserInstitution) {
    return this.institutionsService.deleteUserInstitution(action.id, action.userId).pipe(
      tap(() => {
        ctx.dispatch(GetUserInstitutions);
      })
    );
  }

  @Action(GetAccountSettings)
  getAccountSettings(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.getSettings().pipe(
      tap({
        next: (settings) => {
          ctx.patchState({
            accountSettings: settings,
          });
        },
      })
    );
  }

  @Action(UpdateAccountSettings)
  updateAccountSettings(ctx: StateContext<AccountSettingsStateModel>, action: UpdateAccountSettings) {
    return this.accountSettingsService.updateSettings(action.accountSettings).pipe(
      tap({
        next: (settings) => {
          ctx.patchState({
            accountSettings: settings,
          });
        },
      })
    );
  }

  @Action(DisableTwoFactorAuth)
  disableTwoFactorAuth(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ two_factor_enabled: 'false' }).pipe(
      tap({
        next: (settings) => {
          ctx.patchState({
            accountSettings: settings,
          });
        },
      })
    );
  }

  @Action(EnableTwoFactorAuth)
  enableTwoFactorAuth(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ two_factor_enabled: 'true' }).pipe(
      tap({
        next: (settings) => {
          ctx.patchState({
            accountSettings: settings,
          });
        },
      })
    );
  }

  @Action(SetAccountSettings)
  setAccountSettings(ctx: StateContext<AccountSettingsStateModel>, action: SetAccountSettings) {
    ctx.patchState({ accountSettings: action.accountSettings });
  }

  @Action(DeactivateAccount)
  deactivateAccount(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ deactivation_requested: 'true' }).pipe(
      tap({
        next: (settings) => {
          ctx.patchState({
            accountSettings: settings,
          });
        },
      })
    );
  }

  @Action(CancelDeactivationRequest)
  cancelDeactivationRequest(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ deactivation_requested: 'false' }).pipe(
      tap({
        next: (settings) => {
          ctx.patchState({
            accountSettings: settings,
          });
        },
      })
    );
  }
}
