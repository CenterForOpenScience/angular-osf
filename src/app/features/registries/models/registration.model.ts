import { LicenseOptions } from '@osf/shared/models';

export interface Registration {
  id: string;
  title: string;
  description: string;
  registrationSchemaId: string;
  license: {
    id: string;
    options: LicenseOptions;
  };
  tags: string[];
}
