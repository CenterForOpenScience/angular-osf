import { AsyncStateModel, Institution } from '@shared/models';
import { BaseSearchStateModel } from '@shared/stores/base-search';

export interface InstitutionsSearchModel extends BaseSearchStateModel {
  institution: AsyncStateModel<Institution>;
  providerIri: string;
}
