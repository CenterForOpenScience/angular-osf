export interface NodeData {
  id: string;
  type: 'nodes';
  attributes: NodeAttributes;
  relationships: NodeRelationships;
  links: NodeLinks;
  lastFetched?: number;
}

export interface NodeResponseModel {
  data: NodeData;
  meta: NodeMeta;
}

export interface UpdateNodeRequestModel {
  data: UpdateNodeData;
}

export interface CreateProjectPayloadJsoApi {
  data: {
    type: 'nodes';
    attributes: {
      title: string;
      description?: string;
      category: 'project';
      template_from?: string;
    };
    relationships: {
      region: {
        data: {
          type: 'regions';
          id: string;
        };
      };
      affiliated_institutions?: {
        data: {
          type: 'institutions';
          id: string;
        }[];
      };
    };
  };
}

interface NodeAttributes {
  title: string;
  description: string;
  category: string;
  custom_citation: string | null;
  date_created: string;
  date_modified: string;
  registration: boolean;
  preprint: boolean;
  fork: boolean;
  collection: boolean;
  tags: string[];
  access_requests_enabled: boolean;
  node_license: unknown | null;
  current_user_can_comment: boolean;
  current_user_permissions: string[];
  current_user_is_contributor: boolean;
  current_user_is_contributor_or_group_member: boolean;
  wiki_enabled: boolean;
  public: boolean;
  subjects: unknown[];
}

interface RelationshipLinks {
  related: {
    href: string;
    meta: Record<string, unknown>;
  };
  self?: {
    href: string;
    meta: Record<string, unknown>;
  };
}

interface NodeRelationships {
  children: { links: RelationshipLinks };
  comments: { links: RelationshipLinks };
  contributors: { links: RelationshipLinks };
  bibliographic_contributors: { links: RelationshipLinks };
  implicit_contributors: { links: RelationshipLinks };
  files: { links: RelationshipLinks };
  settings: {
    links: RelationshipLinks;
    data: { id: string; type: 'node-setting' };
  };
  wikis: { links: RelationshipLinks };
  forks: { links: RelationshipLinks };
  groups: { links: RelationshipLinks };
  node_links: { links: RelationshipLinks };
  linked_by_nodes: { links: RelationshipLinks };
  linked_by_registrations: { links: RelationshipLinks };
  parent: {
    links: RelationshipLinks;
    data: { id: string; type: 'nodes' };
  };
  identifiers: { links: RelationshipLinks };
  affiliated_institutions: { links: RelationshipLinks };
  draft_registrations: { links: RelationshipLinks };
  registrations: { links: RelationshipLinks };
  region: {
    links: RelationshipLinks;
    data: { id: string; type: 'regions' };
  };
  root: {
    links: RelationshipLinks;
    data: { id: string; type: 'nodes' };
  };
  logs: { links: RelationshipLinks };
  linked_nodes: { links: RelationshipLinks };
  linked_registrations: { links: RelationshipLinks };
  view_only_links: { links: RelationshipLinks };
  citation: {
    links: RelationshipLinks;
    data: { id: string; type: 'citation' };
  };
  preprints: { links: RelationshipLinks };
  storage: {
    links: RelationshipLinks;
    data: { id: string; type: 'node-storage' };
  };
  cedar_metadata_records: { links: RelationshipLinks };
  subjects_acceptable: { links: RelationshipLinks };
}

interface NodeLinks {
  html: string;
  self: string;
  iri: string;
}

interface NodeMeta {
  version: string;
}

interface UpdateNodeAttributes {
  description?: string;
  tags?: string[];
  public?: boolean;
  title?: string;
}

interface UpdateNodeData {
  type: 'nodes';
  id: string;
  attributes: UpdateNodeAttributes;
}
