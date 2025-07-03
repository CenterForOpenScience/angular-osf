import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';

export interface SubjectsResponseJsonApi {
  data: SubjectDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type SubjectDataJsonApi = ApiData<
  SubjectAttributesJsonApi,
  SubjectEmbedsJsonApi,
  SubjectRelationshipsJsonApi,
  SubjectLinksJsonApi
>;

interface SubjectAttributesJsonApi {
  text: string;
  taxonomy_name: string;
}

interface SubjectLinksJsonApi {
  iri: string;
}

interface SubjectRelationshipsJsonApi {
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
        meta: {
          count: number;
        };
      };
    };
  };
}

interface SubjectEmbedsJsonApi {
  parent?: {
    data: SubjectDataJsonApi;
  };
}
