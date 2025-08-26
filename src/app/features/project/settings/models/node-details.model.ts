import { IdName, Institution } from '@osf/shared/models';

export interface NodeDetailsModel {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  region: IdName;
  affiliatedInstitutions: Institution[];
  lastFetched: number;
}
