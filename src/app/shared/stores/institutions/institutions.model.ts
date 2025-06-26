import { Institution } from '@shared/models';
import { AsyncStateWithTotalCount } from '@shared/models/store/async-state-with-total-count.model';

export interface InstitutionsStateModel {
  userInstitutions: Institution[];
  institutions: AsyncStateWithTotalCount<Institution[]>;
}
