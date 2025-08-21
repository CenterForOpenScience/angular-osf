/**
 * JSON:API response structure for a single external addon.
 */
export interface AddonGetResponseJsonApi {
  /**
   * Resource type (e.g., 'external-storage-services').
   */
  type: string;
  /**
   * Unique identifier for the addon.
   */
  id: string;
  /**
   * Addon metadata fields returned from the API.
   */
  attributes: {
    /**
     * OAuth authorization URI for the external provider.
     */
    auth_uri: string;
    /**
     * Human-readable name of the addon (e.g., "Google Drive").
     */
    display_name: string;
    /**
     * List of supported capabilities for this addon
     * (e.g., 'DOWNLOAD_AS_ZIP', 'PERMISSIONS').
     */
    supported_features: string[];
    /**
     * Internal identifier for the external provider
     * (e.g., 'googledrive', 'figshare').
     */
    external_service_name: string;
    /**
     * Type of credentials used to authenticate
     * (e.g., 'OAUTH2', 'S3').
     */
    credentials_format: string;
    /**
     * Internal WaterButler key used for routing and integration.
     */
    wb_key: string;
    /**
     * Additional provider-specific fields (if present).
     */
    [key: string]: unknown;
  };
  /**
   * Object relationships to other API resources.
   */
  relationships: {
    /**
     * Reference to the associated addon implementation.
     */
    addon_imp: {
      data: {
        /**
         * Resource type of the related addon implementation.
         */
        type: string;
        /**
         * Resource ID of the related addon implementation.
         */
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
  };
}

/**
 * Interface representing the JSON:API response shape for a configured addon.
 *
 * This structure is returned from the backend when querying for configured addons
 * related to a specific resource or user. It conforms to the JSON:API specification.
 */
export interface ConfiguredAddonGetResponseJsonApi {
  /**
   * The resource type (e.g., "configured-storage-addons").
   */
  type: string;
  /**
   * Unique identifier of the configured addon.
   */
  id: string;
  /**
   * Attributes associated with the configured addon.
   */
  attributes: {
    /**
     * Display name shown to users (e.g., "Google Drive").
     */
    display_name: string;
    /**
     * Internal identifier of the external storage service (e.g., "googledrive").
     */
    external_service_name: string;
    /**
     * ID of the root folder selected during configuration.
     */
    root_folder: string;
    /**
     * List of capabilities enabled for this addon (e.g., "DOWNLOAD", "UPLOAD").
     */
    connected_capabilities: string[];
    /**
     * List of operation names tied to the addon configuration.
     */
    connected_operation_names: string[];
    /**
     * Indicates whether the current user is the owner of this addon configuration.
     */
    current_user_is_owner: boolean;
  };

  /**
   * Relationships to other entities, such as accounts or external services.
   */
  relationships: {
    /**
     * Reference to the base account used for this addon.
     */
    base_account: {
      data: {
        /**
         * Resource type of the account (e.g., "accounts").
         */
        type: string;
        /**
         * Unique identifier of the account.
         */
        id: string;
      };
    };

    /**
     * Reference to the underlying external storage service (e.g., Dropbox, Drive).
     */
    external_storage_service: {
      data: {
        /**
         * Resource type of the storage service.
         */
        type: string;
        /**
         * Unique identifier of the storage service.
         */
        id: string;
      };
    };
  };
}

/**
 * Normalized model representing an external addon provider.
 */
export interface AddonModel {
  /**
   * Resource type, typically 'external-storage-services'.
   */
  type: string;
  /**
   * Unique identifier of the addon instance.
   */
  id: string;
  /**
   * OAuth authorization URI for initiating credential flow.
   */
  authUrl: string;
  /**
   * Human-friendly name of the addon (e.g., 'Google Drive').
   */
  displayName: string;
  /**
   * Machine-friendly name of the addon (e.g., 'googledrive').
   */
  externalServiceName: string;
  /**
   * List of supported features or capabilities the addon provides.
   */
  supportedFeatures: string[];
  /**
   * Credential mechanism used by the addon (e.g., 'OAUTH2', 'S3').
   */
  credentialsFormat: string;
  /**
   * Provider key used internally (e.g., for icon or routing).
   */
  providerName: string;
  /**
   * Internal WaterButler key used for addon routing.
   */
  wbKey: string;
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
    external_storage_service: {
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
      root_folder: string;
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
