export interface AddonGetResponseJsonApi {
  type: string;
  id: string;
  attributes: {
    auth_uri: string;
    display_name: string;
    supported_features: string[];
    supported_resource_types?: string[];
    external_service_name: string;
    credentials_format: string;
    wb_key: string;
    icon_url: string;
    [key: string]: unknown;
  };
  relationships: {
    addon_imp: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

export interface AuthorizedAddonGetResponseJsonApi {
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
    oauth_token?: string;
  };
  relationships: {
    account_owner: {
      data: {
        type: string;
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
    external_link_service?: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

export interface ConfiguredAddonGetResponseJsonApi {
  type: string;
  id: string;
  attributes: {
    display_name: string;
    external_service_name: string;
    root_folder?: string;
    resource_type?: string;
    target_id?: string;
    target_url?: string;
    connected_capabilities: string[];
    connected_operation_names: string[];
    current_user_is_owner: boolean;
  };
  relationships: {
    base_account: {
      data: {
        type: string;
        id: string;
      };
    };
    external_storage_service: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

export interface AddonModel {
  type: string;
  id: string;
  authUrl: string;
  displayName: string;
  externalServiceName: string;
  supportedFeatures: string[];
  supportedResourceTypes?: string[];
  credentialsFormat: string;
  providerName: string;
  wbKey: string;
  iconUrl: string;
}

export interface IncludedAddonData {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<
    string,
    {
      data?: {
        type: string;
        id: string;
      };
    }
  >;
}

export interface UserReferenceJsonApi {
  type: string;
  id: string;
  attributes: {
    user_uri: string;
  };
}

export interface ResourceReferenceJsonApi {
  type: string;
  id: string;
  attributes: {
    resource_uri: string;
  };
}

export interface AuthorizedAddonRequestJsonApi {
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
      external_link_service?: {
        data: {
          type: string;
          id: string;
        };
      };
    };
    type: string;
  };
}

export interface AuthorizedAddonResponseJsonApi {
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
    external_link_service?: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

export interface ConfiguredAddonRequestJsonApi {
  data: {
    attributes: {
      authorized_resource_uri: string;
      display_name: string;
      connected_capabilities: string[];
      connected_operation_names: string[];
      root_folder?: string | null;
      target_id?: string | null;
      target_url?: string | null;
      external_service_name: string;
    };
    relationships: {
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
      base_account: {
        data: {
          type: string;
          id: string;
        };
      };
      authorized_resource?: {
        data: {
          type: string;
          id: string;
        };
      };
      account_owner: {
        data: {
          type: string;
          id: string;
        };
      };
    };
    type: string;
    id?: string;
  };
}

export interface ConfiguredAddonResponseJsonApi {
  data: {
    type: string;
    id: string;
    attributes: {
      display_name: string;
      root_folder: string;
      resource_type?: string;
      target_id?: string;
      target_url?: string;
      connected_capabilities: string[];
      connected_operation_names: string[];
      current_user_is_owner: boolean;
      external_service_name: string;
    };
    relationships: {
      base_account: {
        data: {
          type: string;
          id: string;
        };
      };
      authorized_resource: {
        data: {
          type: string;
          id: string;
        };
      };
      external_storage_service: {
        data: {
          type: string;
          id: string;
        };
      };
    };
    links: {
      self: string;
    };
  };
}
