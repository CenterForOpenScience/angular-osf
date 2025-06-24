import { AsyncStateModel, Resource } from '@shared/models';

export interface RegistriesStateModel {
  registries: AsyncStateModel<Resource[]>;
}
