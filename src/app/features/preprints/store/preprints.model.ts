import { PreprintProviderDetails, PreprintProviderToAdvertise, Subject } from '@osf/features/preprints/models';
import { AsyncStateModel } from '@shared/models';

export interface PreprintsStateModel {
  preprintProviderDetails: AsyncStateModel<PreprintProviderDetails | null>;
  preprintProvidersToAdvertise: AsyncStateModel<PreprintProviderToAdvertise[]>;
  highlightedSubjectsForProvider: AsyncStateModel<Subject[]>;
}
