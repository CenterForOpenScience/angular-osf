import { PreprintProviderDetails, PreprintProviderShortInfo, Subject } from '@osf/features/preprints/models';
import { AsyncStateModel } from '@shared/models';

export interface PreprintsStateModel {
  preprintProvidersDetails: AsyncStateModel<PreprintProviderDetails[]>;
  preprintProvidersToAdvertise: AsyncStateModel<PreprintProviderShortInfo[]>;
  preprintProvidersAllowingSubmissions: AsyncStateModel<PreprintProviderShortInfo[]>;
  highlightedSubjectsForProvider: AsyncStateModel<Subject[]>;
}
