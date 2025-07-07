import { Selector } from '@ngxs/store';

import { License, Resource, Subject } from '@shared/models';

import { PageSchema, Project, Provider, Registration } from '../models';

import { RegistriesStateModel } from './registries.model';
import { RegistriesState } from './registries.state';

export class RegistriesSelectors {
  @Selector([RegistriesState])
  static getProviders(state: RegistriesStateModel): Provider[] {
    return state.providers.data;
  }

  @Selector([RegistriesState])
  static isProvidersLoading(state: RegistriesStateModel): boolean {
    return state.providers.isLoading;
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
  static getDraftRegistration(state: RegistriesStateModel): Registration | null {
    return state.draftRegistration.data;
  }

  @Selector([RegistriesState])
  static getRegistrationLoading(state: RegistriesStateModel): boolean {
    return state.draftRegistration.isLoading || state.draftRegistration.isSubmitting || state.pagesSchema.isLoading;
  }

  @Selector([RegistriesState])
  static getRegistries(state: RegistriesStateModel): Resource[] {
    return state.registries.data;
  }

  @Selector([RegistriesState])
  static isRegistriesLoading(state: RegistriesStateModel): boolean {
    return state.registries.isLoading;
  }

  @Selector([RegistriesState])
  static getLicenses(state: RegistriesStateModel): License[] {
    return state.licenses.data;
  }

  @Selector([RegistriesState])
  static getSelectedLicense(state: RegistriesStateModel) {
    return state.draftRegistration.data?.license || null;
  }

  @Selector([RegistriesState])
  static getPagesSchema(state: RegistriesStateModel): PageSchema[] {
    return state.pagesSchema.data;
  }

  @Selector([RegistriesState])
  static getSelectedSubjects(state: RegistriesStateModel): Subject[] {
    return state.registrationSubjects.data;
  }

  @Selector([RegistriesState])
  static isSubjectsUpdating(state: RegistriesStateModel): boolean {
    return state.registrationSubjects.isLoading;
  }
}
