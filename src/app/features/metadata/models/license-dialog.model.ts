import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { LicenseOptions } from '@osf/shared/models/license/license.model';

import { MetadataModel } from './metadata.model';

export interface LicenseDialogData {
  metadata?: MetadataModel | null;
  resourceType?: ResourceType;
  providerId?: string;
}

export interface LicenseDialogResult {
  licenseId: string;
  licenseOptions?: LicenseOptions;
}
