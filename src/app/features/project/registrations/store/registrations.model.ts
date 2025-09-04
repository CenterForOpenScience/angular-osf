import { AsyncStateWithTotalCount, RegistrationCard } from '@osf/shared/models';

export interface RegistrationsStateModel {
  registrations: AsyncStateWithTotalCount<RegistrationCard[]>;
}

export const REGISTRATIONS_STATE_DEFAULTS: RegistrationsStateModel = {
  registrations: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
