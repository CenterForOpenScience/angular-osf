import { Selector } from '@ngxs/store';

import { MetadataStateModel } from '@osf/features/project/metadata/store/project-metadata.model';

import { ProjectMetadataState } from './project-metadata.state';

export class ProjectMetadataSelectors {
  @Selector([ProjectMetadataState])
  static getProject(state: MetadataStateModel) {
    return state.project;
  }

  @Selector([ProjectMetadataState])
  static getProjectLoading(state: MetadataStateModel) {
    return state.projectLoading;
  }

  @Selector([ProjectMetadataState])
  static getCustomItemMetadata(state: MetadataStateModel) {
    return state.customItemMetadata;
  }

  @Selector([ProjectMetadataState])
  static getLoading(state: MetadataStateModel) {
    return state.loading;
  }

  @Selector([ProjectMetadataState])
  static getError(state: MetadataStateModel) {
    return state.error;
  }

  @Selector([ProjectMetadataState])
  static getFundersList(state: MetadataStateModel) {
    return state.fundersList;
  }

  @Selector([ProjectMetadataState])
  static getFundersLoading(state: MetadataStateModel) {
    return state.fundersLoading;
  }

  @Selector([ProjectMetadataState])
  static getCedarTemplates(state: MetadataStateModel) {
    return state.cedarTemplates;
  }

  @Selector([ProjectMetadataState])
  static getCedarTemplatesLoading(state: MetadataStateModel) {
    return state.cedarTemplatesLoading;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecord(state: MetadataStateModel) {
    return state.cedarRecord;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecordLoading(state: MetadataStateModel) {
    return state.cedarRecordLoading;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecords(state: MetadataStateModel) {
    return state.cedarRecords;
  }

  @Selector([ProjectMetadataState])
  static getCedarRecordsLoading(state: MetadataStateModel) {
    return state.cedarRecordsLoading;
  }

  @Selector([ProjectMetadataState])
  static getUserInstitutions(state: MetadataStateModel) {
    return state.userInstitutions || [];
  }

  @Selector([ProjectMetadataState])
  static getUserInstitutionsLoading(state: MetadataStateModel): boolean {
    return state.userInstitutionsLoading;
  }
}
