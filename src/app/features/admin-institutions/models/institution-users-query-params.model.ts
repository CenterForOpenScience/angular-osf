import { QueryParams } from '@shared/models';

export interface InstitutionsUsersQueryParamsModel extends QueryParams {
  department?: string | null;
  hasOrcid?: boolean;
}
