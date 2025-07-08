import { Education, Employment } from '@osf/shared/models';

export interface ContributorModel {
  id: string;
  userId: string;
  type: string;
  isBibliographic: boolean;
  isCurator: boolean;
  permission: string;
  fullName: string;
  employment: Employment[];
  education: Education[];
}
