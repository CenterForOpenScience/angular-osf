import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { MetaJsonApi } from '@shared/models/common/json-api.model';
import { RegistrationNodeModel } from '@shared/models/registration/registration-node.model';

export interface RegistrationOverviewModel extends RegistrationNodeModel {
  registrationSchemaLink: string;
  licenseId: string;
  associatedProjectId: string;
  providerId: string;
  status: RegistryStatus;
  forksCount: number;
  rootParentId?: string;
}

export interface RegistryOverviewWithMeta {
  registry: RegistrationOverviewModel;
  meta?: MetaJsonApi;
}
