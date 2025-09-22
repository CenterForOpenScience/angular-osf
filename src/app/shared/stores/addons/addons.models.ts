import {
  Addon,
  AsyncStateModel,
  AuthorizedAccount,
  ConfiguredAddon,
  ConfiguredAddonResponseJsonApi,
  OperationInvocation,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@osf/shared/models';

export interface AddonsStateModel {
  storageAddons: AsyncStateModel<Addon[]>;
  citationAddons: AsyncStateModel<Addon[]>;
  linkAddons: AsyncStateModel<Addon[]>;
  authorizedStorageAddons: AsyncStateModel<AuthorizedAccount[]>;
  authorizedCitationAddons: AsyncStateModel<AuthorizedAccount[]>;
  authorizedLinkAddons: AsyncStateModel<AuthorizedAccount[]>;
  configuredStorageAddons: AsyncStateModel<ConfiguredAddon[]>;
  configuredCitationAddons: AsyncStateModel<ConfiguredAddon[]>;
  configuredLinkAddons: AsyncStateModel<ConfiguredAddon[]>;
  addonsUserReference: AsyncStateModel<UserReferenceJsonApi[]>;
  addonsResourceReference: AsyncStateModel<ResourceReferenceJsonApi[]>;
  createdUpdatedAuthorizedAddon: AsyncStateModel<AuthorizedAccount | null>;
  createdUpdatedConfiguredAddon: AsyncStateModel<ConfiguredAddonResponseJsonApi | null>;
  operationInvocation: AsyncStateModel<OperationInvocation | null>;
  selectedItemOperationInvocation: AsyncStateModel<OperationInvocation | null>;
}

export const ADDONS_DEFAULTS: AddonsStateModel = {
  storageAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  citationAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  linkAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  authorizedStorageAddons: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  authorizedCitationAddons: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  authorizedLinkAddons: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  configuredStorageAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  configuredCitationAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  configuredLinkAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  addonsUserReference: {
    data: [],
    isLoading: false,
    error: null,
  },
  addonsResourceReference: {
    data: [],
    isLoading: false,
    error: null,
  },
  createdUpdatedAuthorizedAddon: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  createdUpdatedConfiguredAddon: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  operationInvocation: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  selectedItemOperationInvocation: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
