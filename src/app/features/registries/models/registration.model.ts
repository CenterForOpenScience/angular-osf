import { LicenseOptions } from '@osf/shared/models';

export interface Registration {
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
}
