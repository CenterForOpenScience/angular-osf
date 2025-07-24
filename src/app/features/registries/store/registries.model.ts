import {
  AsyncStateModel,
  AsyncStateWithTotalCount,
  DraftRegistrationModel,
  License,
  OsfFile,
  RegistrationCard,
  RegistrationModel,
  Resource,
} from '@shared/models';

import { PageSchema, Project, ProviderSchema } from '../models';

export interface RegistriesStateModel {
  providerSchemas: AsyncStateModel<ProviderSchema[]>;
  projects: AsyncStateModel<Project[]>;
  draftRegistration: AsyncStateModel<DraftRegistrationModel | null>;
  registration: AsyncStateModel<RegistrationModel | null>;
  registries: AsyncStateModel<Resource[]>;
  licenses: AsyncStateModel<License[]>;
  pagesSchema: AsyncStateModel<PageSchema[]>;
  stepsValidation: Record<string, { invalid: boolean }>;
  draftRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  submittedRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  files: AsyncStateModel<OsfFile[]>;
  currentFolder: OsfFile | null;
  moveFileCurrentFolder: OsfFile | null;
  rootFolders: AsyncStateModel<OsfFile[] | null>;
}
