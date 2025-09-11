import { Selector } from '@ngxs/store';

import { RegistrationsStateModel } from './registrations.model';
import { RegistrationsState } from './registrations.state';

export class RegistrationsSelectors {
  @Selector([RegistrationsState])
  static getRegistrations(state: RegistrationsStateModel) {
    return state.registrations.data;
  }

  @Selector([RegistrationsState])
  static getRegistrationsTotalCount(state: RegistrationsStateModel): number {
    return state.registrations.totalCount;
  }

  @Selector([RegistrationsState])
  static isRegistrationsLoading(state: RegistrationsStateModel) {
    return state.registrations.isLoading;
  }
}
