import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { DraftRegistrationModel } from '@osf/shared/models/registration/draft-registration.model';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import { ProviderSchema } from '@osf/shared/models/registration/provider-schema.model';
import { RegistrationModel } from '@osf/shared/models/registration/registration.model';
import { RegistrationCard } from '@osf/shared/models/registration/registration-card.model';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { ResourceModel } from '@osf/shared/models/search/resource.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

import { ProjectShortInfoModel } from '../models';

export interface RegistriesStateModel {
  providerSchemas: AsyncStateModel<ProviderSchema[]>;
  projects: AsyncStateModel<ProjectShortInfoModel[]>;
  draftRegistration: AsyncStateModel<DraftRegistrationModel | null>;
  registration: AsyncStateModel<RegistrationModel | null>;
  registries: AsyncStateModel<ResourceModel[]>;
  licenses: AsyncStateModel<LicenseModel[]>;
  pagesSchema: AsyncStateModel<PageSchema[]>;
  stepsState: Record<string, { invalid: boolean; touched: boolean }>;
  draftRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  submittedRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  files: AsyncStateWithTotalCount<FileModel[]>;
  currentFolder: FileFolderModel | null;
  rootFolders: AsyncStateModel<FileFolderModel[] | null>;
  schemaResponse: AsyncStateModel<SchemaResponse | null>;
  updatedFields: Record<string, unknown>;
}

export const REGISTRIES_STATE_DEFAULTS: RegistriesStateModel = {
  providerSchemas: {
    data: [],
    isLoading: false,
    error: null,
  },
  projects: {
    data: [],
    isLoading: false,
    error: null,
  },
  draftRegistration: {
    isLoading: false,
    data: null,
    isSubmitting: false,
    error: null,
  },
  registries: {
    data: [],
    isLoading: false,
    error: null,
  },
  licenses: {
    data: [],
    isLoading: false,
    error: null,
  },
  pagesSchema: {
    data: [],
    isLoading: false,
    error: null,
  },
  stepsState: {},
  registration: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  draftRegistrations: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  submittedRegistrations: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  files: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  currentFolder: null,
  rootFolders: {
    data: null,
    isLoading: false,
    error: null,
  },
  schemaResponse: {
    data: null,
    isLoading: false,
    error: null,
  },
  updatedFields: {},
};
