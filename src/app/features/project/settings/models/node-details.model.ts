import { UserPermissions } from '@osf/shared/enums';
import { IdName, Institution } from '@osf/shared/models';

export interface NodeDetailsModel {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  region: IdName;
  affiliatedInstitutions: Institution[];
  currentUserPermissions: UserPermissions[];
  rootId?: string;
  parentId?: string;
  lastFetched: number;
}
