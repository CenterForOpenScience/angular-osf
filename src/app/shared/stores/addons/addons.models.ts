import { AddonModel } from '@osf/shared/models/addons/addon.model';
import {
  ConfiguredAddonResponseJsonApi,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@osf/shared/models/addons/addon-json-api.models';
import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { OperationInvocation } from '@osf/shared/models/addons/operation-invocation.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface AddonsStateModel {
  storageAddons: AsyncStateModel<AddonModel[]>;
  citationAddons: AsyncStateModel<AddonModel[]>;
  linkAddons: AsyncStateModel<AddonModel[]>;
  authorizedStorageAddons: AsyncStateModel<AuthorizedAccountModel[]>;
  authorizedCitationAddons: AsyncStateModel<AuthorizedAccountModel[]>;
  authorizedLinkAddons: AsyncStateModel<AuthorizedAccountModel[]>;
  configuredStorageAddons: AsyncStateModel<ConfiguredAddonModel[]>;
  configuredCitationAddons: AsyncStateModel<ConfiguredAddonModel[]>;
  configuredLinkAddons: AsyncStateModel<ConfiguredAddonModel[]>;
  addonsUserReference: AsyncStateModel<UserReferenceJsonApi[]>;
  addonsResourceReference: AsyncStateModel<ResourceReferenceJsonApi[]>;
  createdUpdatedAuthorizedAddon: AsyncStateModel<AuthorizedAccountModel | null>;
  createdUpdatedConfiguredAddon: AsyncStateModel<ConfiguredAddonResponseJsonApi | null>;
  operationInvocation: AsyncStateModel<OperationInvocation | null>;
  selectedItemOperationInvocation: AsyncStateModel<OperationInvocation | null>;
  citationOperationInvocations: Record<string, AsyncStateModel<OperationInvocation | null>>;
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
  citationOperationInvocations: {},
};
