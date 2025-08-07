import { ReviewAction } from '@osf/features/moderation/models';
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
  moderationActions: AsyncStateModel<ReviewAction[]>;
}

export const REGISTRY_OVERVIEW_DEFAULTS: RegistryOverviewStateModel = {
  registry: {
    data: null,
    isLoading: false,
    error: null,
  },
  subjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  institutions: {
    data: [],
    isLoading: false,
    error: null,
  },
  schemaBlocks: {
    data: [],
    isLoading: false,
    error: null,
  },
  moderationActions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
