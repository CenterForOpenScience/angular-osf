import { Selector } from '@ngxs/store';

import { RegistriesStateModel } from '@osf/features/registries/store/registries.model';
import { RegistriesState } from '@osf/features/registries/store/registries.state';
import { Resource } from '@shared/models';

export class RegistriesSelectors {
  @Selector([RegistriesState])
  static getRegistries(state: RegistriesStateModel): Resource[] {
    return state.registries.data;
  }

  @Selector([RegistriesState])
  static isRegistriesLoading(state: RegistriesStateModel): boolean {
    return state.registries.isLoading;
  }
}
