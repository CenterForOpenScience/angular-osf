import { Selector } from '@ngxs/store';

import { MetadataStateModel } from './metadata.model';
import { MetadataState } from './metadata.state';

export class MetadataSelectors {
  @Selector([MetadataState])
  static getProject(state: MetadataStateModel) {
    return state.project.data;
  }

  @Selector([MetadataState])
  static getProjectLoading(state: MetadataStateModel) {
    return state.project.isLoading;
  }

  @Selector([MetadataState])
  static getCustomItemMetadata(state: MetadataStateModel) {
    return state.customItemMetadata.data;
  }

  @Selector([MetadataState])
  static getLoading(state: MetadataStateModel) {
    return state.project.isLoading;
  }

  @Selector([MetadataState])
  static getError(state: MetadataStateModel) {
    return state.project.error;
  }

  @Selector([MetadataState])
  static getFundersList(state: MetadataStateModel) {
    return state.fundersList.data;
  }

  @Selector([MetadataState])
  static getFundersLoading(state: MetadataStateModel) {
    return state.fundersList.isLoading;
  }

  @Selector([MetadataState])
  static getCedarTemplates(state: MetadataStateModel) {
    return state.cedarTemplates.data;
  }

  @Selector([MetadataState])
  static getCedarTemplatesLoading(state: MetadataStateModel) {
    return state.cedarTemplates.isLoading;
  }

  @Selector([MetadataState])
  static getCedarRecord(state: MetadataStateModel) {
    return state.cedarRecord.data;
  }

  @Selector([MetadataState])
  static getCedarRecordLoading(state: MetadataStateModel) {
    return state.cedarRecord.isLoading;
  }

  @Selector([MetadataState])
  static getCedarRecords(state: MetadataStateModel) {
    return state.cedarRecords.data;
  }

  @Selector([MetadataState])
  static getCedarRecordsLoading(state: MetadataStateModel) {
    return state.cedarRecords.isLoading;
  }

  @Selector([MetadataState])
  static getUserInstitutions(state: MetadataStateModel) {
    return state.userInstitutions.data;
  }

  @Selector([MetadataState])
  static getUserInstitutionsLoading(state: MetadataStateModel): boolean {
    return state.userInstitutions.isLoading;
  }
}
