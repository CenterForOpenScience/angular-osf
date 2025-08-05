import { Selector } from '@ngxs/store';

import { ResourceType } from '@shared/enums';

import { ResourceTypeStateModel } from './resource-type.model';
import { ResourceTypeState } from './resource-type.state';

export class ResourceTypeSelectors {
  @Selector([ResourceTypeState])
  static getCurrentResourceType(state: ResourceTypeStateModel): ResourceType | null {
    return state.currentResourceType.data;
  }

  @Selector([ResourceTypeState])
  static getCurrentResourceId(state: ResourceTypeStateModel): string | null {
    return state.currentResourceId;
  }

  @Selector([ResourceTypeState])
  static isCurrentResourceProject(state: ResourceTypeStateModel): boolean {
    return state.currentResourceType.data === ResourceType.Project;
  }

  @Selector([ResourceTypeState])
  static isCurrentResourceRegistry(state: ResourceTypeStateModel): boolean {
    return state.currentResourceType.data === ResourceType.Registration;
  }
}
