import { Scope } from '@osf/features/settings/tokens/entities/scope.interface';

// API Request Model
export interface TokenCreateRequest {
  data: {
    attributes: {
      name: string;
      scopes: string;
    };
    type: 'tokens';
  };
}

// API Response Model
export interface TokenCreateResponse {
  data: {
    id: string;
    type: 'tokens';
    attributes: {
      name: string;
      token_id: string;
    };
    relationships: {
      scopes: {
        links: {
          related: {
            href: string;
            meta: Record<string, unknown>;
          };
        };
      };
      owner: {
        links: {
          related: {
            href: string;
            meta: Record<string, unknown>;
          };
        };
        data: {
          id: string;
          type: string;
        };
      };
    };
    embeds: {
      scopes: {
        data: Scope[];
        meta: {
          total: number;
          per_page: number;
        };
        links: {
          self: string;
          first: string | null;
          last: string | null;
          prev: string | null;
          next: string | null;
        };
      };
    };
    links: {
      html: string;
      self: string;
    };
  };
  meta: {
    version: string;
  };
}

// Domain Models
export interface Token {
  id: string;
  name: string;
  tokenId: string;
  scopes: string[];
  ownerId: string;
  htmlUrl: string;
  apiUrl: string;
}
