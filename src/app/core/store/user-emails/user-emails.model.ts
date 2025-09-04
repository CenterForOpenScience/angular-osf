import { AccountEmailModel, AsyncStateModel } from '@shared/models';

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
