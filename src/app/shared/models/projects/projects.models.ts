import { StringOrNull } from '@shared/helpers';
import { LicenseOptions } from '@shared/models';

export interface Project {
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
