import { RegistriesStateModel } from './registries.model';

export const DefaultState: RegistriesStateModel = {
  providers: {
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
  registrationSubjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  pagesSchema: {
    data: [],
    isLoading: false,
    error: null,
  },
};
