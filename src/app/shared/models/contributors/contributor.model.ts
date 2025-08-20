import { Education, Employment } from '@osf/shared/models';

export interface ContributorModel {
  id: string;
  userId: string;
  type: string;
  isBibliographic: boolean;
  isCurator: boolean;
  permission: string;
  fullName: string;
  givenName: string;
  familyName: string;
  employment: Employment[];
  education: Education[];
}
