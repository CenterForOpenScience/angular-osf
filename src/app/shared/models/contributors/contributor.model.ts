import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { Education } from '@osf/shared/models/user/education.model';
import { Employment } from '@osf/shared/models/user/employment.model';

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
  deactivated: boolean;
}

export type ContributorShortInfoModel = Pick<
  ContributorModel,
  'id' | 'userId' | 'fullName' | 'isUnregisteredContributor' | 'isBibliographic' | 'index' | 'permission'
>;
