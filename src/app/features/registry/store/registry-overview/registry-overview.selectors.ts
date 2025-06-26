import { Selector } from '@ngxs/store';

import { RegistryOverview } from '@osf/features/registry/models';
import { RegistryOverviewStateModel } from '@osf/features/registry/store/registry-overview/registry-overview.model';
import { RegistryOverviewState } from '@osf/features/registry/store/registry-overview/registry-overview.state';

export class RegistryOverviewSelectors {
  @Selector([RegistryOverviewState])
  static getRegistry(state: RegistryOverviewStateModel): RegistryOverview | null {
    return state.registry.data;
  }

  @Selector([RegistryOverviewState])
  static isRegistryLoading(state: RegistryOverviewStateModel): boolean {
    return state.registry.isLoading;
  }
}
