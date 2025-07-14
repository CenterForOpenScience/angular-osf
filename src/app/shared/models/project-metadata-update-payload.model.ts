import { LicenseOptions } from '@shared/models/license.model';

export interface ProjectMetadataUpdatePayload {
  id: string;
  title: string;
  description: string;
  tags: string[];
  licenseId: string;
  licenseOptions?: LicenseOptions | null;
}
