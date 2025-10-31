import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';

import { ContributorModel } from '../contributors/contributor.model';

export interface ComponentOverview {
  id: string;
  type: string;
  title: string;
  description: string;
  public: boolean;
  contributors: ContributorModel[];
  currentUserIsContributor: boolean;
  currentUserPermissions: UserPermissions[];
  parentId?: string;
}
