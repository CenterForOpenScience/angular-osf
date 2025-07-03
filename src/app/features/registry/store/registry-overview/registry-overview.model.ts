import { RegistryInstitution, RegistryOverview, RegistrySubject } from '@osf/features/registry/models';
import { RegistrySchemaBlock } from '@osf/features/registry/models/registry-schema-block.model';
import { AsyncStateModel } from '@shared/models';

export interface RegistryOverviewStateModel {
  registry: AsyncStateModel<RegistryOverview | null>;
  subjects: AsyncStateModel<RegistrySubject[] | null>;
  institutions: AsyncStateModel<RegistryInstitution[] | null>;
  schemaBlocks: AsyncStateModel<RegistrySchemaBlock[] | null>;
}
