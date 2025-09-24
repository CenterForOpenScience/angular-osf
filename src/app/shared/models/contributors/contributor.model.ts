import { ContributorPermission } from '@osf/shared/enums';
import { Education, Employment } from '@osf/shared/models';

export interface ContributorModel {
  id: string;
  userId: string;
  type: string;
  isBibliographic: boolean;
  isUnregisteredContributor: boolean;
  isCurator: boolean;
  permission: ContributorPermission;
  index: number;
  fullName: string;
  givenName: string;
  familyName: string;
  employment: Employment[];
  education: Education[];
}

export type ContributorShortInfoModel = Pick<ContributorModel, 'id' | 'userId' | 'fullName'>;
