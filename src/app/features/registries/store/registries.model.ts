import { DraftRegistrationModel, RegistrationModel } from '@osf/shared/models/registration';
import { AsyncStateModel, License, Resource } from '@shared/models';

import { PageSchema, Project, Provider } from '../models';

export interface RegistriesStateModel {
  providers: AsyncStateModel<Provider[]>;
  projects: AsyncStateModel<Project[]>;
  draftRegistration: AsyncStateModel<DraftRegistrationModel | null>;
  registration: AsyncStateModel<RegistrationModel | null>;
  registries: AsyncStateModel<Resource[]>;
  licenses: AsyncStateModel<License[]>;
  pagesSchema: AsyncStateModel<PageSchema[]>;
  stepsValidation: Record<string, { invalid: boolean }>;
}
