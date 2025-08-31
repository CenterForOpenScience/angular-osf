import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { AsyncStateModel } from '@shared/models';

export interface RegistriesProviderSearchStateModel {
  currentBrandedProvider: AsyncStateModel<RegistryProviderDetails | null>;
}
