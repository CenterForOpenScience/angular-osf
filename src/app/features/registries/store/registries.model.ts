import { ContributorModel } from '@osf/shared/components/contributors/models';
import { AsyncStateModel, Resource, Subject } from '@shared/models';

import { License, PageSchema, Project, Provider } from '../models';
import { Registration } from '../models/registration.model';

export interface RegistriesStateModel {
  providers: AsyncStateModel<Provider[]>;
  projects: AsyncStateModel<Project[]>;
  draftRegistration: AsyncStateModel<Registration | null>;
  contributorsList: AsyncStateModel<ContributorModel[]>;
  registries: AsyncStateModel<Resource[]>;
  licenses: AsyncStateModel<License[]>;
  registrationSubjects: AsyncStateModel<Subject[]>;
  pagesSchema: AsyncStateModel<PageSchema[]>;
}
