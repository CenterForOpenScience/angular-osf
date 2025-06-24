import { Selector } from '@ngxs/store';

import { Resource } from '@shared/models';

import { Project, Provider } from '../models';

import { RegistriesStateModel } from './registries.model';
import { RegistriesState } from './registries.state';

export class RegistriesSelectors {
  @Selector([RegistriesState])
  static getProviders(state: RegistriesStateModel): Provider[] {
    return state.providers.data;
  }

  @Selector([RegistriesState])
  static getProjects(state: RegistriesStateModel): Project[] {
    return state.projects.data;
  }

  @Selector([RegistriesState])
  static isDraftSubmitting(state: RegistriesStateModel): boolean {
    return state.draftRegistration.isSubmitting ?? false;
  }

  @Selector([RegistriesState])
  static getContributors(state: RegistriesStateModel) {
    return state.contributorsList.data;
  }

  @Selector([RegistriesState])
  static getRegistries(state: RegistriesStateModel): Resource[] {
    return state.registries.data;
  }

  @Selector([RegistriesState])
  static isRegistriesLoading(state: RegistriesStateModel): boolean {
    return state.registries.isLoading;
  }
}
