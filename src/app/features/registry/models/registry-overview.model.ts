import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { RegistrationNodeModel } from '@shared/models/registration/registration-node.model';

export interface RegistrationOverviewModel extends RegistrationNodeModel {
  associatedProjectId?: string;
  forksCount: number;
  licenseId: string;
  providerId: string;
  registrationSchemaLink: string;
  rootParentId?: string;
  status: RegistryStatus;
}

export interface RegistryOverviewWithMeta {
  registry: RegistrationOverviewModel;
  isAnonymous: boolean;
}
