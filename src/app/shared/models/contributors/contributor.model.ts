import { Education, Employment } from '@osf/shared/models';
import { ContributorPermission } from '@shared/enums';

export interface ContributorModel {
  id: string;
  userId: string;
  type: string;
  isBibliographic: boolean;
  isUnregisteredContributor: boolean;
  isCurator: boolean;
  permission: ContributorPermission;
  fullName: string;
  givenName: string;
  familyName: string;
  employment: Employment[];
  education: Education[];
}
