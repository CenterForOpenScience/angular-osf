import { RegistrationCard } from '@osf/shared/models';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store';

export interface RegistrationsStateModel {
  registrations: AsyncStateWithTotalCount<RegistrationCard[]>;
}
