import { Selector } from '@ngxs/store';

import { RegionsStateModel } from './regions.model';
import { RegionsState } from './regions.state';

export class RegionsSelectors {
  @Selector([RegionsState])
  static getRegions(state: RegionsStateModel) {
    return state.regions.data;
  }

  @Selector([RegionsState])
  static areRegionsLoading(state: RegionsStateModel) {
    return state.regions.isLoading;
  }
}
