import { Selector } from '@ngxs/store';

import { CurrentResource } from '@osf/shared/models';
import { CurrentResourceType } from '@shared/enums';

import { CurrentResourceStateModel } from './current-resource.model';
import { CurrentResourceState } from './current-resource.state';

export class CurrentResourceSelectors {
  @Selector([CurrentResourceState])
  static getCurrentResource(state: CurrentResourceStateModel): CurrentResource | null {
    return state.currentResource.data;
  }

  @Selector([CurrentResourceState])
  static isCurrentResourceProject(state: CurrentResourceStateModel): boolean {
    return state.currentResource.data?.type === CurrentResourceType.Project;
  }

  @Selector([CurrentResourceState])
  static isCurrentResourceRegistry(state: CurrentResourceStateModel): boolean {
    return state.currentResource.data?.type === CurrentResourceType.Registration;
  }
}
