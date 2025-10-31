import { RegistrationCard } from '@osf/shared/models/registration/registration-card.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

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
