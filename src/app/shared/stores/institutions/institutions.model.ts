import { AsyncStateWithTotalCount, Institution } from '@osf/shared/models';

export interface InstitutionsStateModel {
  userInstitutions: Institution[];
  institutions: AsyncStateWithTotalCount<Institution[]>;
}
