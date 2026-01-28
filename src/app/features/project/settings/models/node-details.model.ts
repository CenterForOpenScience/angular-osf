import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { IdNameModel } from '@shared/models/common/id-name.model';

export interface NodeDetailsModel {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  region: IdNameModel | null;
  affiliatedInstitutions: Institution[];
  currentUserPermissions: UserPermissions[];
  rootId?: string;
  parentId?: string;
  lastFetched: number;
}
