import { ReviewAction } from '@osf/features/moderation/models';
import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';
import { Institution } from '@osf/shared/models/institutions/institutions.models';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { RegistrationOverviewModel } from '../../models';

export interface RegistryStateModel {
  registry: AsyncStateModel<RegistrationOverviewModel | null>;
  institutions: AsyncStateModel<Institution[] | null>;
  identifiers: AsyncStateModel<IdentifierModel[]>;
  license: AsyncStateModel<LicenseModel | null>;
  schemaBlocks: AsyncStateModel<PageSchema[] | null>;
  schemaResponses: AsyncStateModel<SchemaResponse[]>;
  currentSchemaResponse: AsyncStateModel<SchemaResponse | null>;
  moderationActions: AsyncStateModel<ReviewAction[]>;
  isAnonymous: boolean;
}

export const REGISTRY_DEFAULTS: RegistryStateModel = {
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
  moderationActions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  identifiers: {
    data: [],
    isLoading: false,
    error: null,
  },
  license: {
    data: null,
    isLoading: false,
    error: null,
  },
  schemaBlocks: {
    data: [],
    isLoading: false,
    error: null,
  },
  schemaResponses: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentSchemaResponse: {
    data: null,
    isLoading: false,
    error: null,
  },
  isAnonymous: false,
};
