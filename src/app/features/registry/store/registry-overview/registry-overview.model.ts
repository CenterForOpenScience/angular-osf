import { ReviewAction } from '@osf/features/moderation/models';
import { RegistryOverview, RegistrySubject } from '@osf/features/registry/models';
import { Institution, PageSchema } from '@osf/shared/models';
import { AsyncStateModel } from '@shared/models';

export interface RegistryOverviewStateModel {
  registry: AsyncStateModel<RegistryOverview | null>;
  subjects: AsyncStateModel<RegistrySubject[] | null>;
  institutions: AsyncStateModel<Institution[] | null>;
  schemaBlocks: AsyncStateModel<PageSchema[] | null>;
  moderationActions: AsyncStateModel<ReviewAction[]>;
  isAnonymous: boolean;
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
  isAnonymous: false,
};
