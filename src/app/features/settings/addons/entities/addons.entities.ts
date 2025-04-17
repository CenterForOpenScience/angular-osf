export interface AddonGetResponse {
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

export interface AuthorizedAddonGetResponse {
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
    external_storage_service?: {
      links: {
        related: string;
      };
      data: {
        type: string;
        id: string;
      };
    };
    external_citation_service?: {
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
  authUrl: string;
  displayName: string;
  externalServiceName: string;
  supportedFeatures: string[];
  credentialsFormat: string;
  providerName: string;
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
  supportedFeatures: string[];
  providerName: string;
  credentialsFormat: string;
}

export interface IncludedAddonData {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<
    string,
    {
      links: {
        related: string;
      };
      data?: {
        type: string;
        id: string;
      };
    }
  >;
  links?: {
    self: string;
  };
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

export interface AddonRequest {
  data: {
    id?: string;
    attributes: {
      display_name: string;
      authorized_capabilities: string[];
      api_base_url: string;
      credentials: Record<string, unknown>;
      initiate_oauth: boolean;
      auth_url: string | null;
      credentials_available: boolean;
    };
    relationships: {
      account_owner: {
        data: {
          type: 'user-references';
          id: string;
        };
      };
      external_storage_service?: {
        data: {
          type: string;
          id: string;
        };
      };
      external_citation_service?: {
        data: {
          type: string;
          id: string;
        };
      };
    };
    type: string;
  };
}

export interface AddonResponse {
  type: string;
  id: string;
  attributes: {
    display_name: string;
    api_base_url: string;
    auth_url: string;
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
        type: 'user-references';
        id: string;
      };
    };
    authorized_operations: {
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
