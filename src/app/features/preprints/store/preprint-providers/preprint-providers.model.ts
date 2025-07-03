import { PreprintProviderDetails, PreprintProviderShortInfo } from '@osf/features/preprints/models';
import { AsyncStateModel, Subject } from '@shared/models';

export interface PreprintProvidersStateModel {
  preprintProvidersDetails: AsyncStateModel<PreprintProviderDetails[]>;
  preprintProvidersToAdvertise: AsyncStateModel<PreprintProviderShortInfo[]>;
  preprintProvidersAllowingSubmissions: AsyncStateModel<PreprintProviderShortInfo[]>;
  highlightedSubjectsForProvider: AsyncStateModel<Subject[]>;
}
