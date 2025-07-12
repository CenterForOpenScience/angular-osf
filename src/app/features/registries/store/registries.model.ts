import {
  AsyncStateModel,
  DraftRegistrationModel,
  License,
  RegistrationCard,
  RegistrationModel,
  Resource,
} from '@shared/models';

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
  draftRegistrations: AsyncStateModel<RegistrationCard[]> & {
    totalCount: number;
  };
  submittedRegistrations: AsyncStateModel<RegistrationCard[]> & {
    totalCount: number;
  };
}
