import { RegistriesStateModel } from './registries.model';

export const DefaultState: RegistriesStateModel = {
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
