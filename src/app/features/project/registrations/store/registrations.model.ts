import { AsyncStateModel } from '@osf/shared/models/store';

import { RegistrationModel } from '../models';

export interface RegistrationsStateModel {
  registrations: AsyncStateModel<RegistrationModel[]>;
}
