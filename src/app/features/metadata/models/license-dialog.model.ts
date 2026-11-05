import { LicenseOptions } from '@osf/shared/models/license/license.model';

import { MetadataModel } from './metadata.model';

export interface LicenseDialogData {
  metadata?: MetadataModel | null;
  licensesUrl?: string;
}

export interface LicenseDialogResult {
  licenseId: string;
  licenseOptions?: LicenseOptions;
}
