import { AccountEmailModel } from '@osf/shared/models/emails/account-email.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface UserEmailsStateModel {
  emails: AsyncStateModel<AccountEmailModel[]>;
}

export const USER_EMAILS_STATE_DEFAULTS: UserEmailsStateModel = {
  emails: {
    data: [],
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
};
