import {
  RegistryInstitution,
  RegistryOverview,
  RegistrySchemaBlock,
  RegistrySubject,
} from '@osf/features/registry/models';
import { AsyncStateModel } from '@shared/models';

export interface RegistryOverviewStateModel {
  registry: AsyncStateModel<RegistryOverview | null>;
  subjects: AsyncStateModel<RegistrySubject[] | null>;
  institutions: AsyncStateModel<RegistryInstitution[] | null>;
  schemaBlocks: AsyncStateModel<RegistrySchemaBlock[] | null>;
}
