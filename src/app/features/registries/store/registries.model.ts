import { AsyncStateModel, License, Resource } from '@shared/models';

import { PageSchema, Project, Provider } from '../models';
import { Registration } from '../models/registration.model';

export interface RegistriesStateModel {
  providers: AsyncStateModel<Provider[]>;
  projects: AsyncStateModel<Project[]>;
  draftRegistration: AsyncStateModel<Registration | null>;
  registries: AsyncStateModel<Resource[]>;
  licenses: AsyncStateModel<License[]>;
  pagesSchema: AsyncStateModel<PageSchema[]>;
  stepsValidation: Record<string, { invalid: boolean }>;
}
