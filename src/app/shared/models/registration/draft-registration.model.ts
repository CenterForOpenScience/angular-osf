import { UserPermissions } from '@shared/enums/user-permissions.enum';

import { LicenseOptions } from '../license/license.model';
import { ProjectModel } from '../projects/projects.models';

export interface DraftRegistrationModel {
  id: string;
  title: string;
  description: string;
  registrationSchemaId: string;
  license: {
    id: string;
    options: LicenseOptions | null;
  };
  tags: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepsData?: Record<string, any>;
  branchedFrom?: Partial<ProjectModel>;
  providerId: string;
  hasProject: boolean;
  components: Partial<ProjectModel>[];
  currentUserPermissions: UserPermissions[];
}
