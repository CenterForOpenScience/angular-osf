import { Selector } from '@ngxs/store';

import { BaseNodeModel, CurrentResource, NodeShortInfoModel } from '@osf/shared/models';
import { UserPermissions } from '@shared/enums';

import { CurrentResourceStateModel } from './current-resource.model';
import { CurrentResourceState } from './current-resource.state';

export class CurrentResourceSelectors {
  @Selector([CurrentResourceState])
  static getCurrentResource(state: CurrentResourceStateModel): CurrentResource | null {
    return state.currentResource.data;
  }

  @Selector([CurrentResourceState])
  static getResourceDetails(state: CurrentResourceStateModel): BaseNodeModel {
    return state.resourceDetails.data;
  }

  @Selector([CurrentResourceState])
  static getResourceWithChildren(state: CurrentResourceStateModel): NodeShortInfoModel[] {
    return state.resourceChildren.data;
  }

  @Selector([CurrentResourceState])
  static hasWriteAccess(state: CurrentResourceStateModel): boolean {
    return state.currentResource.data?.permissions?.includes(UserPermissions.Write) || false;
  }

  @Selector([CurrentResourceState])
  static hasAdminAccess(state: CurrentResourceStateModel): boolean {
    return state.currentResource.data?.permissions?.includes(UserPermissions.Admin) || false;
  }

  @Selector([CurrentResourceState])
  static hasNoPermissions(state: CurrentResourceStateModel): boolean {
    return !state.currentResource.data?.permissions?.length;
  }

  @Selector([CurrentResourceState])
  static isResourceDetailsLoading(state: CurrentResourceStateModel): boolean {
    return state.resourceDetails.isLoading;
  }

  @Selector([CurrentResourceState])
  static isResourceWithChildrenLoading(state: CurrentResourceStateModel): boolean {
    return state.resourceChildren.isLoading;
  }

  @Selector([CurrentResourceState])
  static hasResourceWriteAccess(state: CurrentResourceStateModel): boolean {
    return state.resourceDetails.data?.currentUserPermissions?.includes(UserPermissions.Write) || false;
  }

  @Selector([CurrentResourceState])
  static hasResourceAdminAccess(state: CurrentResourceStateModel): boolean {
    return state.resourceDetails.data?.currentUserPermissions?.includes(UserPermissions.Admin) || false;
  }

  @Selector([CurrentResourceState])
  static resourceAccessRequestEnabled(state: CurrentResourceStateModel): boolean {
    return state.resourceDetails.data?.accessRequestsEnabled;
  }

  @Selector([CurrentResourceState])
  static getCurrentUserPermissions(currentResourceState: CurrentResourceStateModel): string[] {
    return currentResourceState.resourceDetails.data.currentUserPermissions || [];
  }
}
