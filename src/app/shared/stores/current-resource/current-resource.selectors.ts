import { Selector } from '@ngxs/store';

import { CurrentResource } from '@osf/shared/models';

import { CurrentResourceStateModel } from './current-resource.model';
import { CurrentResourceState } from './current-resource.state';

export class CurrentResourceSelectors {
  @Selector([CurrentResourceState])
  static getCurrentResource(state: CurrentResourceStateModel): CurrentResource | null {
    return state.currentResource.data;
  }
}
