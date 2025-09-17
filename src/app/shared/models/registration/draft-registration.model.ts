import { LicenseOptions } from '../license.model';
import { ProjectModel } from '../projects';

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
}
