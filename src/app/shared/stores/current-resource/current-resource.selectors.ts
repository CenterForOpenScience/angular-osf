import { Selector } from '@ngxs/store';

import { BaseNodeModel, CurrentResource } from '@osf/shared/models';

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
  static getResourceChildren(state: CurrentResourceStateModel): BaseNodeModel[] {
    return state.resourceChildren.data;
  }

  @Selector([CurrentResourceState])
  static isResourceDetailsLoading(state: CurrentResourceStateModel): boolean {
    return state.resourceDetails.isLoading;
  }

  @Selector([CurrentResourceState])
  static isResourceChildrenLoading(state: CurrentResourceStateModel): boolean {
    return state.resourceChildren.isLoading;
  }
}
