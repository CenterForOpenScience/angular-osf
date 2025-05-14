import { Selector } from '@ngxs/store';

import { DeveloperApp } from '@osf/features/settings/developer-apps/entities/developer-apps.models';
import { DeveloperAppsState } from '@osf/features/settings/developer-apps/store/developer-apps.state';
import { DeveloperAppsStateModel } from '@osf/features/settings/developer-apps/store/developer-apps.state-model';

export class DeveloperAppsSelectors {
  @Selector([DeveloperAppsState])
  static getDeveloperApps(state: DeveloperAppsStateModel): DeveloperApp[] {
    return state.developerApps;
  }

  @Selector([DeveloperAppsState])
  static getDeveloperAppDetails(state: DeveloperAppsStateModel): (clientId: string) => DeveloperApp | undefined {
    return (clientId: string) => state.developerApps.find((app) => app.clientId === clientId);
  }
}
