import { MetaJsonApi } from '@osf/shared/models';

export interface BibliographicContributorJsonApi {
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
  embeds: {
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

export interface BibliographicContributorsResponse {
  data: BibliographicContributorJsonApi[];
  meta: MetaJsonApi;
}

export interface NodeBibliographicContributor {
  id: string;
  userId: string;
  fullName: string;
  givenName: string;
  middleNames: string;
  familyName: string;
  suffix: string;
  dateRegistered: string;
  isActive: boolean;
  timezone: string;
  locale: string;
  profileImage: string;
  profileUrl: string;
  permission: string;
  isBibliographic: boolean;
  isCurator: boolean;
}
