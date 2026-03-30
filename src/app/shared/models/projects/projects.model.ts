import { StringOrNull } from '@osf/shared/helpers/types.helper';

import { LicenseOptions } from '../license/license.model';

export interface ProjectModel {
  id: string;
  type: string;
  title: string;
  dateModified: string;
  isPublic: boolean;
  licenseId: StringOrNull;
  licenseOptions: LicenseOptions | null;
  description: string;
  tags: string[];
  filesLink?: string;
}
