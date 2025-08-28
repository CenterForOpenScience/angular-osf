import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { AsyncStateModel } from '@shared/models';
import { BaseSearchStateModel } from '@shared/stores';

export interface RegistriesProviderSearchStateModel extends BaseSearchStateModel {
  currentBrandedProvider: AsyncStateModel<RegistryProviderDetails | null>;
  providerIri: string;
}
