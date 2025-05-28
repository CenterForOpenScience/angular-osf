import { PreprintProviderDetails, PreprintProviderToAdvertise } from '@osf/features/preprints/models';
import { AsyncStateModel } from '@shared/models';

export interface PreprintsStateModel {
  preprintProviderDetails: AsyncStateModel<PreprintProviderDetails | null>;
  preprintProvidersToAdvertise: AsyncStateModel<PreprintProviderToAdvertise[]>;
}
