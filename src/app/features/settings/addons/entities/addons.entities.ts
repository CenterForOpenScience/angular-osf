export interface AddonResponse {
  type: string;
  id: string;
  attributes: {
    auth_uri: string;
    display_name: string;
    supported_features: string[];
    external_service_name: string;
    credentials_format: string;
    [key: string]: unknown;
  };
  relationships: {
    addon_imp: {
      links: {
        related: string;
      };
      data: {
        type: string;
        id: string;
      };
    };
  };
  links: {
    self: string;
  };
}

export interface AuthorizedAddonResponse {
  type: string;
  id: string;
  attributes: {
    display_name: string;
    api_base_url: string;
    auth_url: string | null;
    authorized_capabilities: string[];
    authorized_operation_names: string[];
    default_root_folder: string;
    credentials_available: boolean;
  };
  relationships: {
    account_owner: {
      links: {
        related: string;
      };
      data: {
        type: string;
        id: string;
      };
    };
    authorized_operations: {
      links: {
        related: string;
      };
    };
    configured_storage_addons: {
      links: {
        related: string;
      };
    };
    external_storage_service: {
      links: {
        related: string;
      };
      data: {
        type: string;
        id: string;
      };
    };
  };
  links: {
    self: string;
  };
}

export interface Addon {
  type: string;
  id: string;
  authUri: string;
  displayName: string;
  externalServiceName: string;
  supportedFeatures: string[];
  credentialsFormat: string;
}

export interface AuthorizedAddon {
  type: string;
  id: string;
  displayName: string;
  apiBaseUrl: string;
  authUrl: string | null;
  authorizedCapabilities: string[];
  authorizedOperationNames: string[];
  defaultRootFolder: string;
  credentialsAvailable: boolean;
  accountOwnerId: string;
  externalStorageServiceId: string;
  externalServiceName: string;
}

export interface UserReference {
  type: string;
  id: string;
  attributes: {
    user_uri: string;
  };
  relationships: {
    authorized_storage_accounts: {
      links: {
        related: string;
      };
    };
    authorized_citation_accounts: {
      links: {
        related: string;
      };
    };
    authorized_computing_accounts: {
      links: {
        related: string;
      };
    };
    configured_resources: {
      links: {
        related: string;
      };
    };
  };
  links: {
    self: string;
  };
}
