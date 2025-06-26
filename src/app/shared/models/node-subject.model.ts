import { LinkTableModel } from '@osf/features/project/settings/models';

export interface NodeSubjectModel {
  id: string;
  text: string;
  taxonomy_name: string;
  parent?: NodeSubjectModel;
  children?: NodeSubjectModel[];
  level: number;
}

export interface SubjectData extends UpdateSubjectRequestJsonApi {
  attributes: {
    text: string;
    taxonomy_name: string;
  };
  relationships: {
    parent?: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
      data?: {
        id: string;
        type: 'subjects';
      };
    };
    children: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
    };
  };
  embeds?: {
    parent?: {
      data: SubjectData;
    };
  };
  links: {
    self: string;
    iri: string;
  };
}

export interface SubjectJsonApi {
  data: SubjectData[];
  links: {
    first: string | null;
    last: string;
    prev: string | null;
    next: string | null;
    meta: {
      total: number;
      per_page: number;
    };
  };
  meta: {
    version: string;
  };
}

export interface UpdateSubjectRequestJsonApi {
  id: string;
  type: 'subjects';
}

export interface UpdateSubjectResponseJsonApi {
  data: UpdateSubjectRequestJsonApi[];
  links: LinkTableModel;
  meta: {
    version: string;
  };
}
