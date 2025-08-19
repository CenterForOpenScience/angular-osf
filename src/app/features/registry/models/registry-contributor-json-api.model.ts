import { MetaJsonApi } from '@osf/shared/models';

export interface RegistryContributorJsonApi {
  id: string;
  type: 'contributors';
  attributes: {
    index: number;
    bibliographic: boolean;
    permission: string;
    unregistered_contributor: string | null;
    is_curator: boolean;
  };
  relationships: {
    users: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
      data: {
        id: string;
        type: 'users';
      };
    };
    node: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
      data: {
        id: string;
        type: 'nodes';
      };
    };
  };
  embeds?: {
    users: {
      data: {
        id: string;
        type: 'users';
        attributes: {
          full_name: string;
          given_name: string;
          middle_names: string;
          family_name: string;
          suffix: string;
          date_registered: string;
          active: boolean;
          timezone: string;
          locale: string;
          social: Record<string, unknown>;
          employment: unknown[];
          education: unknown[];
        };
        relationships: Record<string, unknown>;
        links: {
          html: string;
          profile_image: string;
          self: string;
          iri: string;
        };
      };
    };
  };
  links: {
    self: string;
  };
}

export interface RegistryContributorJsonApiResponse {
  data: RegistryContributorJsonApi;
  links: {
    self: string;
  };
  meta: MetaJsonApi;
}

export interface RegistryContributorUpdateRequest {
  data: {
    id: string;
    type: 'contributors';
    attributes: Record<string, unknown>;
    relationships: Record<string, unknown>;
  };
}

export interface RegistryContributorAddRequest {
  data: {
    type: 'contributors';
    attributes: Record<string, unknown>;
    relationships: Record<string, unknown>;
  };
}
