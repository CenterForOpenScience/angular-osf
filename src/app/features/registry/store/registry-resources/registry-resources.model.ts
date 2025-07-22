import { RegistryResource } from '@osf/features/registry/models/resources/registry-resource.model';
import { AsyncStateModel } from '@shared/models';

export interface RegistryResourcesStateModel {
  resources: AsyncStateModel<RegistryResource[] | null>;
}
