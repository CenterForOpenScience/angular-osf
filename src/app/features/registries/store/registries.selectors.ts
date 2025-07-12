import { Selector } from '@ngxs/store';

import { DraftRegistrationModel, License, RegistrationCard, Resource } from '@shared/models';

import { PageSchema, Project, Provider } from '../models';

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
  static getDraftRegistration(state: RegistriesStateModel): DraftRegistrationModel | null {
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
  static getSelectedTags(state: RegistriesStateModel): string[] {
    return state.draftRegistration.data?.tags || [];
  }

  @Selector([RegistriesState])
  static getStepsValidation(state: RegistriesStateModel): Record<string, { invalid: boolean }> {
    return state.stepsValidation;
  }

  @Selector([RegistriesState])
  static getStepsData(state: RegistriesStateModel) {
    return state.draftRegistration.data?.stepsData || {};
  }

  @Selector([RegistriesState])
  static isRegistrationSubmitting(state: RegistriesStateModel): boolean {
    return state.registration.isSubmitting || false;
  }

  @Selector([RegistriesState])
  static getDraftRegistrations(state: RegistriesStateModel): RegistrationCard[] {
    return state.draftRegistrations.data;
  }

  @Selector([RegistriesState])
  static isDraftRegistrationsLoading(state: RegistriesStateModel): boolean {
    return state.draftRegistrations.isLoading;
  }

  @Selector([RegistriesState])
  static getSubmittedRegistrations(state: RegistriesStateModel): RegistrationCard[] {
    return state.submittedRegistrations.data;
  }

  @Selector([RegistriesState])
  static isSubmittedRegistrationsLoading(state: RegistriesStateModel): boolean {
    return state.submittedRegistrations.isLoading;
  }
}
