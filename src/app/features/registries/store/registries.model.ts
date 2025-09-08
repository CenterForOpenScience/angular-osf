import {
  AsyncStateModel,
  AsyncStateWithTotalCount,
  DraftRegistrationModel,
  LicenseModel,
  OsfFile,
  PageSchema,
  RegistrationCard,
  RegistrationModel,
  ResourceModel,
  SchemaResponse,
} from '@shared/models';

import { Project, ProviderSchema } from '../models';

export interface RegistriesStateModel {
  providerSchemas: AsyncStateModel<ProviderSchema[]>;
  projects: AsyncStateModel<Project[]>;
  draftRegistration: AsyncStateModel<DraftRegistrationModel | null>;
  registration: AsyncStateModel<RegistrationModel | null>;
  registries: AsyncStateModel<ResourceModel[]>;
  licenses: AsyncStateModel<LicenseModel[]>;
  pagesSchema: AsyncStateModel<PageSchema[]>;
  stepsValidation: Record<string, { invalid: boolean }>;
  draftRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  submittedRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  files: AsyncStateWithTotalCount<OsfFile[]>;
  currentFolder: OsfFile | null;
  moveFileCurrentFolder: OsfFile | null;
  rootFolders: AsyncStateModel<OsfFile[] | null>;
  schemaResponse: AsyncStateModel<SchemaResponse | null>;
  updatedFields: Record<string, unknown>;
}
