import { Education } from '@osf/shared/models/user/education.model';
import { Employment } from '@osf/shared/models/user/employment.model';

import { ModeratorPermission } from '../enums';

export interface ModeratorModel {
  id: string;
  userId: string;
  fullName: string;
  permission: ModeratorPermission;
  employment: Employment[];
  education: Education[];
}
