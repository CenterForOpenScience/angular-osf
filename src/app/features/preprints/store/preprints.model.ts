import { PreprintProviderDetails, PreprintProviderToAdvertise, Subject } from '@osf/features/preprints/models';
import { AsyncStateModel } from '@shared/models';

export interface PreprintsStateModel {
  preprintProvidersDetails: AsyncStateModel<PreprintProviderDetails[]>;
  preprintProvidersToAdvertise: AsyncStateModel<PreprintProviderToAdvertise[]>;
  highlightedSubjectsForProvider: AsyncStateModel<Subject[]>;
}
