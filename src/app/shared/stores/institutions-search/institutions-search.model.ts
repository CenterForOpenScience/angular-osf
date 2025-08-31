import { AsyncStateModel, Institution } from '@shared/models';

export interface InstitutionsSearchModel {
  institution: AsyncStateModel<Institution>;
}
