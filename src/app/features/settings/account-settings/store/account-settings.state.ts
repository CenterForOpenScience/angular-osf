import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SetCurrentUser } from '@core/store/user';
import { handleSectionError } from '@osf/core/handlers';
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
  ResendConfirmation,
  UpdateAccountSettings,
  UpdateIndexing,
  UpdatePassword,
  UpdateRegion,
  VerifyEmail,
  VerifyTwoFactorAuth,
} from './account-settings.actions';
import { ACCOUNT_SETTINGS_STATE_DEFAULTS, AccountSettingsStateModel } from './account-settings.model';

@Injectable()
@State<AccountSettingsStateModel>({
  name: 'accountSettings',
  defaults: ACCOUNT_SETTINGS_STATE_DEFAULTS,
})
export class AccountSettingsState {
  private readonly accountSettingsService = inject(AccountSettingsService);
  private readonly institutionsService = inject(InstitutionsService);

  @Action(GetEmails)
  getEmails(ctx: StateContext<AccountSettingsStateModel>) {
    const state = ctx.getState();

    ctx.patchState({ emails: { ...state.emails, isLoading: true } });

    return this.accountSettingsService.getEmails().pipe(
      tap((emails) => {
        ctx.patchState({
          emails: {
            data: emails,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(AddEmail)
  addEmail(ctx: StateContext<AccountSettingsStateModel>, action: AddEmail) {
    const state = ctx.getState();
    ctx.patchState({ emails: { ...state.emails, isSubmitting: true } });

    return this.accountSettingsService.addEmail(action.email).pipe(
      tap((email) => {
        ctx.patchState({
          emails: {
            data: state.emails.data,
            isSubmitting: false,
            isLoading: false,
            error: null,
          },
        });

        if (email.emailAddress && !email.confirmed) {
          ctx.dispatch(GetEmails);
        }
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(DeleteEmail)
  deleteEmail(ctx: StateContext<AccountSettingsStateModel>, action: DeleteEmail) {
    const state = ctx.getState();
    ctx.patchState({ emails: { ...state.emails, isLoading: true } });

    return this.accountSettingsService.deleteEmail(action.email).pipe(
      tap(() => {
        ctx.patchState({
          emails: {
            data: state.emails.data,
            isSubmitting: false,
            isLoading: false,
            error: null,
          },
        });

        ctx.dispatch(GetEmails);
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(ResendConfirmation)
  resendConfirmation(ctx: StateContext<AccountSettingsStateModel>, action: ResendConfirmation) {
    return this.accountSettingsService
      .resendConfirmation(action.emailId, action.userId)
      .pipe(catchError((error) => throwError(() => error)));
  }

  @Action(VerifyEmail)
  verifyEmail(ctx: StateContext<AccountSettingsStateModel>, action: VerifyEmail) {
    return this.accountSettingsService.verifyEmail(action.userId, action.emailId).pipe(
      tap((email) => {
        if (email.verified) {
          ctx.dispatch(GetEmails);
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(MakePrimary)
  makePrimary(ctx: StateContext<AccountSettingsStateModel>, action: MakePrimary) {
    return this.accountSettingsService.makePrimary(action.emailId).pipe(
      tap((email) => {
        if (email.verified) {
          ctx.dispatch(GetEmails);
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(GetRegions)
  getRegions(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.getRegions().pipe(
      tap((regions) => ctx.patchState({ regions: regions })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(UpdateRegion)
  updateRegion(ctx: StateContext<AccountSettingsStateModel>, action: UpdateRegion) {
    return this.accountSettingsService.updateLocation(action.regionId).pipe(
      tap((user) => ctx.dispatch(new SetCurrentUser(user))),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(UpdateIndexing)
  updateIndexing(ctx: StateContext<AccountSettingsStateModel>, action: UpdateIndexing) {
    return this.accountSettingsService.updateIndexing(action.allowIndexing).pipe(
      tap((user) => ctx.dispatch(new SetCurrentUser(user))),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(GetExternalIdentities)
  getExternalIdentities(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.getExternalIdentities().pipe(
      tap((identities) => ctx.patchState({ externalIdentities: identities })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(DeleteExternalIdentity)
  deleteExternalIdentity(ctx: StateContext<AccountSettingsStateModel>, action: DeleteExternalIdentity) {
    return this.accountSettingsService.deleteExternalIdentity(action.externalId).pipe(
      tap(() => ctx.dispatch(GetExternalIdentities)),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(GetUserInstitutions)
  getUserInstitutions(ctx: StateContext<AccountSettingsStateModel>) {
    return this.institutionsService.getUserInstitutions().pipe(
      tap((userInstitutions) => ctx.patchState({ userInstitutions })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(DeleteUserInstitution)
  deleteUserInstitution(ctx: StateContext<AccountSettingsStateModel>, action: DeleteUserInstitution) {
    return this.institutionsService.deleteUserInstitution(action.id, action.userId).pipe(
      tap(() => ctx.dispatch(GetUserInstitutions)),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(GetAccountSettings)
  getAccountSettings(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.getSettings().pipe(
      tap((settings) => ctx.patchState({ accountSettings: settings })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(UpdateAccountSettings)
  updateAccountSettings(ctx: StateContext<AccountSettingsStateModel>, action: UpdateAccountSettings) {
    return this.accountSettingsService.updateSettings(action.accountSettings).pipe(
      tap((settings) => ctx.patchState({ accountSettings: settings })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(DisableTwoFactorAuth)
  disableTwoFactorAuth(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ two_factor_enabled: 'false' }).pipe(
      tap((settings) => ctx.patchState({ accountSettings: settings })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(EnableTwoFactorAuth)
  enableTwoFactorAuth(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ two_factor_enabled: 'true' }).pipe(
      tap((settings) => ctx.patchState({ accountSettings: settings })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(VerifyTwoFactorAuth)
  verifyTwoFactorAuth(ctx: StateContext<AccountSettingsStateModel>, action: VerifyTwoFactorAuth) {
    return this.accountSettingsService.updateSettings({ two_factor_verification: action.code }).pipe(
      tap((settings) => ctx.patchState({ accountSettings: settings })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(DeactivateAccount)
  deactivateAccount(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ deactivation_requested: 'true' }).pipe(
      tap((settings) => ctx.patchState({ accountSettings: settings })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(CancelDeactivationRequest)
  cancelDeactivationRequest(ctx: StateContext<AccountSettingsStateModel>) {
    return this.accountSettingsService.updateSettings({ deactivation_requested: 'false' }).pipe(
      tap((settings) => ctx.patchState({ accountSettings: settings })),
      catchError((error) => throwError(() => error))
    );
  }

  @Action(UpdatePassword)
  updatePassword(ctx: StateContext<AccountSettingsStateModel>, action: UpdatePassword) {
    return this.accountSettingsService
      .updatePassword(action.oldPassword, action.newPassword)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
