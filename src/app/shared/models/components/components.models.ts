import { UserPermissions } from '@osf/shared/enums';

import { ContributorModel } from '../contributors';

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
