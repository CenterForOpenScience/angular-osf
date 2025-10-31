import { ReviewAction } from '@osf/features/moderation/models';
import { Institution } from '@osf/shared/models/institutions/institutions.models';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { RegistryOverview } from '../../models';

export interface RegistryOverviewStateModel {
  registry: AsyncStateModel<RegistryOverview | null>;
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
