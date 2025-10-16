import { Selector } from '@ngxs/store';

import { UserPermissions } from '@osf/shared/enums';

import { MetadataStateModel } from './metadata.model';
import { MetadataState } from './metadata.state';

export class MetadataSelectors {
  @Selector([MetadataState])
  static getResourceMetadata(state: MetadataStateModel) {
    return state.metadata?.data ?? null;
  }

  @Selector([MetadataState])
  static getCustomItemMetadata(state: MetadataStateModel) {
    return state.customMetadata?.data ?? null;
  }

  @Selector([MetadataState])
  static getLoading(state: MetadataStateModel) {
    return state.metadata?.isLoading || state.customMetadata?.isLoading || false;
  }

  @Selector([MetadataState])
  static getSubmitting(state: MetadataStateModel) {
    return state.metadata?.isSubmitting || state.customMetadata?.isSubmitting || false;
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
  static hasWriteAccess(state: MetadataStateModel): boolean {
    return state.metadata.data?.currentUserPermissions?.includes(UserPermissions.Write) || false;
  }

  @Selector([MetadataState])
  static hasAdminAccess(state: MetadataStateModel): boolean {
    return state.metadata.data?.currentUserPermissions?.includes(UserPermissions.Admin) || false;
  }
}
