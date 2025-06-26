import { Selector } from '@ngxs/store';

import { MetadataStateModel } from '@osf/features/project/metadata/store/project-metadata.model';

import { ProjectMetadataState } from './project-metadata.state';

export class ProjectMetadataSelectors {
  @Selector([ProjectMetadataState])
  static getProject(state: MetadataStateModel) {
    return state.project.data;
  }

  @Selector([ProjectMetadataState])
  static getProjectLoading(state: MetadataStateModel) {
    return state.project.isLoading;
  }

  @Selector([ProjectMetadataState])
  static getCustomItemMetadata(state: MetadataStateModel) {
    return state.customItemMetadata.data;
  }

  @Selector([ProjectMetadataState])
  static getLoading(state: MetadataStateModel) {
    return state.project.isLoading;
  }

  @Selector([ProjectMetadataState])
  static getError(state: MetadataStateModel) {
    return state.project.error;
  }

  @Selector([ProjectMetadataState])
  static getFundersList(state: MetadataStateModel) {
    return state.fundersList.data;
  }

  @Selector([ProjectMetadataState])
  static getFundersLoading(state: MetadataStateModel) {
    return state.fundersList.isLoading;
  }

  @Selector([ProjectMetadataState])
  static getCedarTemplates(state: MetadataStateModel) {
    return state.cedarTemplates.data;
  }

  @Selector([ProjectMetadataState])
  static getCedarTemplatesLoading(state: MetadataStateModel) {
    return state.cedarTemplates.isLoading;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecord(state: MetadataStateModel) {
    return state.cedarRecord.data;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecordLoading(state: MetadataStateModel) {
    return state.cedarRecord.isLoading;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecords(state: MetadataStateModel) {
    return state.cedarRecords.data;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecordsLoading(state: MetadataStateModel) {
    return state.cedarRecords.isLoading;
  }

  @Selector([ProjectMetadataState])
  static getUserInstitutions(state: MetadataStateModel) {
    return state.userInstitutions.data;
  }

  @Selector([ProjectMetadataState])
  static getUserInstitutionsLoading(state: MetadataStateModel): boolean {
    return state.userInstitutions.isLoading;
  }
}
