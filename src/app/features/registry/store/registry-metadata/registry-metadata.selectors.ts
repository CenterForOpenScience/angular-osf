import { Selector } from '@ngxs/store';

import { RegistryMetadataStateModel } from './registry-metadata.model';
import { RegistryMetadataState } from './registry-metadata.state';

export class RegistryMetadataSelectors {
  @Selector([RegistryMetadataState])
  static getRegistry(state: RegistryMetadataStateModel) {
    return state.registry.data;
  }

  @Selector([RegistryMetadataState])
  static getLicense(state: RegistryMetadataStateModel) {
    return state.license.data;
  }

  @Selector([RegistryMetadataState])
  static getLicenseLoading(state: RegistryMetadataStateModel) {
    return state.license.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getRegistryLoading(state: RegistryMetadataStateModel) {
    return state.registry.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getBibliographicContributors(state: RegistryMetadataStateModel) {
    return state.bibliographicContributors.data;
  }

  @Selector([RegistryMetadataState])
  static getBibliographicContributorsLoading(state: RegistryMetadataStateModel) {
    return state.bibliographicContributors.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getCustomItemMetadata(state: RegistryMetadataStateModel) {
    return state.customItemMetadata.data;
  }

  @Selector([RegistryMetadataState])
  static getInstitutions(state: RegistryMetadataStateModel) {
    return state.institutions.data;
  }

  @Selector([RegistryMetadataState])
  static getInstitutionsLoading(state: RegistryMetadataStateModel) {
    return state.institutions.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getCustomItemMetadataLoading(state: RegistryMetadataStateModel) {
    return state.customItemMetadata.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getUserInstitutions(state: RegistryMetadataStateModel) {
    return state.userInstitutions.data;
  }

  @Selector([RegistryMetadataState])
  static getUserInstitutionsLoading(state: RegistryMetadataStateModel): boolean {
    return state.userInstitutions.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getSubjects(state: RegistryMetadataStateModel) {
    return state.subjects.data;
  }

  @Selector([RegistryMetadataState])
  static getSubjectsLoading(state: RegistryMetadataStateModel) {
    return state.subjects.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getCedarTemplates(state: RegistryMetadataStateModel) {
    return state.cedarTemplates.data;
  }

  @Selector([RegistryMetadataState])
  static getCedarTemplatesLoading(state: RegistryMetadataStateModel) {
    return state.cedarTemplates.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getCedarRecord(state: RegistryMetadataStateModel) {
    return state.cedarRecord.data;
  }

  @Selector([RegistryMetadataState])
  static getCedarRecordLoading(state: RegistryMetadataStateModel) {
    return state.cedarRecord.isLoading;
  }

  @Selector([RegistryMetadataState])
  static getCedarRecords(state: RegistryMetadataStateModel) {
    return state.cedarRecords.data;
  }

  @Selector([RegistryMetadataState])
  static getCedarRecordsLoading(state: RegistryMetadataStateModel) {
    return state.cedarRecords.isLoading;
  }
}
