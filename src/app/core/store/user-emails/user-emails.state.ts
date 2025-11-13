import { Action, State, StateContext, Store } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserEmailsService } from '@core/services/user-emails.service';
import { handleSectionError } from '@osf/shared/helpers/state-error.handler';

import { UserSelectors } from '../user/user.selectors';

import { AddEmail, DeleteEmail, GetEmails, MakePrimary, ResendConfirmation, VerifyEmail } from './user-emails.actions';
import { USER_EMAILS_STATE_DEFAULTS, UserEmailsStateModel } from './user-emails.model';

@Injectable()
@State<UserEmailsStateModel>({
  name: 'userEmails',
  defaults: USER_EMAILS_STATE_DEFAULTS,
})
export class UserEmailsState {
  private readonly userEmailsService = inject(UserEmailsService);
  private readonly store = inject(Store);

  @Action(GetEmails)
  getEmails(ctx: StateContext<UserEmailsStateModel>) {
    const currentUser = this.store.selectSnapshot(UserSelectors.getCurrentUser);

    if (!currentUser) {
      return;
    }

    ctx.patchState({
      emails: {
        ...ctx.getState().emails,
        isLoading: true,
        error: null,
      },
    });

    return this.userEmailsService.getEmails().pipe(
      tap((emails) =>
        ctx.patchState({
          emails: {
            data: emails,
            isLoading: false,
            error: null,
            isSubmitting: false,
          },
        })
      ),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(AddEmail)
  addEmail(ctx: StateContext<UserEmailsStateModel>, action: AddEmail) {
    const currentUser = this.store.selectSnapshot(UserSelectors.getCurrentUser);

    if (!currentUser?.id) {
      return;
    }

    ctx.patchState({
      emails: {
        ...ctx.getState().emails,
        isSubmitting: true,
        error: null,
      },
    });

    return this.userEmailsService.addEmail(currentUser.id, action.email).pipe(
      tap((newEmail) => {
        const currentEmails = ctx.getState().emails.data;
        ctx.patchState({
          emails: {
            data: [...currentEmails, newEmail],
            isLoading: false,
            error: null,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(DeleteEmail)
  deleteEmail(ctx: StateContext<UserEmailsStateModel>, action: DeleteEmail) {
    ctx.patchState({
      emails: {
        ...ctx.getState().emails,
        isSubmitting: true,
        error: null,
      },
    });

    return this.userEmailsService.deleteEmail(action.emailId).pipe(
      tap(() => {
        const currentEmails = ctx.getState().emails.data;
        const updatedEmails = currentEmails.filter((email) => email.id !== action.emailId);
        ctx.patchState({
          emails: {
            data: updatedEmails,
            isLoading: false,
            error: null,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(VerifyEmail)
  verifyEmail(ctx: StateContext<UserEmailsStateModel>, action: VerifyEmail) {
    ctx.patchState({
      emails: {
        ...ctx.getState().emails,
        isSubmitting: true,
        error: null,
      },
    });

    return this.userEmailsService.verifyEmail(action.emailId).pipe(
      tap((verifiedEmail) => {
        const currentEmails = ctx.getState().emails.data;
        const updatedEmails = currentEmails.map((email) => (email.id === action.emailId ? verifiedEmail : email));
        ctx.patchState({
          emails: {
            data: updatedEmails,
            isLoading: false,
            error: null,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(ResendConfirmation)
  resendConfirmation(ctx: StateContext<UserEmailsStateModel>, action: ResendConfirmation) {
    ctx.patchState({
      emails: {
        ...ctx.getState().emails,
        isSubmitting: true,
        error: null,
      },
    });

    return this.userEmailsService.resendConfirmation(action.emailId).pipe(
      tap(() => {
        ctx.patchState({
          emails: {
            ...ctx.getState().emails,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }

  @Action(MakePrimary)
  makePrimary(ctx: StateContext<UserEmailsStateModel>, action: MakePrimary) {
    ctx.patchState({
      emails: {
        ...ctx.getState().emails,
        isSubmitting: true,
        error: null,
      },
    });

    return this.userEmailsService.makePrimary(action.emailId).pipe(
      tap((email) => {
        if (email.verified) {
          ctx.dispatch(GetEmails);
        }
      }),
      catchError((error) => handleSectionError(ctx, 'emails', error))
    );
  }
}
