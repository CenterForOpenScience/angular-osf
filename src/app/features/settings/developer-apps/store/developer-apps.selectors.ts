import { Selector } from '@ngxs/store';

import { DeveloperApp } from '../models';

import { DeveloperAppsState } from './developer-apps.state';
import { DeveloperAppsStateModel } from './developer-apps.state-model';

export class DeveloperAppsSelectors {
  @Selector([DeveloperAppsState])
  static getDeveloperApps(state: DeveloperAppsStateModel): DeveloperApp[] {
    return state.data;
  }

  @Selector([DeveloperAppsState])
  static isLoading(state: DeveloperAppsStateModel): boolean {
    return state.isLoading;
  }

  @Selector([DeveloperAppsState])
  static getDeveloperAppDetails(state: DeveloperAppsStateModel): (clientId: string) => DeveloperApp | undefined {
    return (clientId: string) => state.data.find((app) => app.clientId === clientId);
  }
}
