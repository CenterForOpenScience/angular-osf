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

export interface Addon {
  type: string;
  id: string;
  authUri: string;
  displayName: string;
  externalServiceName: string;
  supportedFeatures: string[];
  credentialsFormat: string;
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
