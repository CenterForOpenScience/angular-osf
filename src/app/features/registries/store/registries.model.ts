import {
  AsyncStateModel,
  AsyncStateWithTotalCount,
  DraftRegistrationModel,
  LicenseModel,
  OsfFile,
  PageSchema,
  RegistrationCard,
  RegistrationModel,
  ResourceModel,
  SchemaResponse,
} from '@shared/models';

import { Project, ProviderSchema } from '../models';

export interface RegistriesStateModel {
  providerSchemas: AsyncStateModel<ProviderSchema[]>;
  projects: AsyncStateModel<Project[]>;
  draftRegistration: AsyncStateModel<DraftRegistrationModel | null>;
  registration: AsyncStateModel<RegistrationModel | null>;
  registries: AsyncStateModel<ResourceModel[]>;
  licenses: AsyncStateModel<LicenseModel[]>;
  pagesSchema: AsyncStateModel<PageSchema[]>;
  stepsValidation: Record<string, { invalid: boolean }>;
  draftRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  submittedRegistrations: AsyncStateWithTotalCount<RegistrationCard[]>;
  files: AsyncStateWithTotalCount<OsfFile[]>;
  currentFolder: OsfFile | null;
  moveFileCurrentFolder: OsfFile | null;
  rootFolders: AsyncStateModel<OsfFile[] | null>;
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
  stepsValidation: {},
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
  moveFileCurrentFolder: null,
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
