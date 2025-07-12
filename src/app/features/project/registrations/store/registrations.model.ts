import { RegistrationCard } from '@osf/shared/models';
import { AsyncStateModel } from '@osf/shared/models/store';

export interface RegistrationsStateModel {
  registrations: AsyncStateModel<RegistrationCard[]> & {
    totalCount: number;
  };
}
