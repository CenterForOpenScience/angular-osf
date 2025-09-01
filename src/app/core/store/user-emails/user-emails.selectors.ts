import { Selector } from '@ngxs/store';

import { AccountEmailModel } from '@osf/shared/models';

import { UserEmailsStateModel } from './user-emails.model';
import { UserEmailsState } from './user-emails.state';

export class UserEmailsSelectors {
  @Selector([UserEmailsState])
  static getEmails(state: UserEmailsStateModel): AccountEmailModel[] {
    return state.emails.data;
  }

  @Selector([UserEmailsState])
  static isEmailsLoading(state: UserEmailsStateModel): boolean {
    return state.emails.isLoading;
  }

  @Selector([UserEmailsState])
  static isEmailsSubmitting(state: UserEmailsStateModel): boolean | undefined {
    return state.emails.isSubmitting;
  }

  @Selector([UserEmailsState])
  static getUnverifiedEmails(state: UserEmailsStateModel): AccountEmailModel[] {
    return state.emails.data.filter((email) => email.confirmed && !email.verified);
  }
}
