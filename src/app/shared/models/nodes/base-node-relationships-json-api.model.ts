export interface BaseNodeRelationships {
  affiliated_institutions?: RelationshipWithLinks<'institutions'>;
  bibliographic_contributors?: RelationshipWithLinks<'contributors'>;
  cedar_metadata_records?: RelationshipWithLinks<'cedar-metadata-records'>;
  children?: RelationshipWithLinks<'nodes'>;
  citation?: RelationshipWithLinks<'citations'>;
  comments?: RelationshipWithLinks<'comments'>;
  contributors?: RelationshipWithLinks<'contributors'>;
  draft_registrations?: RelationshipWithLinks<'draft-registrations'>;
  files?: RelationshipWithLinks<'files'>;
  forks?: RelationshipWithLinks<'nodes'>;
  groups?: RelationshipWithLinks<'groups'>;
  identifiers?: RelationshipWithLinks<'identifiers'>;
  implicit_contributors?: RelationshipWithLinks<'contributors'>;
  license?: RelationshipWithLinks<'licenses'>;
  linked_by_nodes?: RelationshipWithLinks<'nodes'>;
  linked_by_registrations?: RelationshipWithLinks<'registrations'>;
  linked_nodes?: RelationshipWithLinks<'nodes'>;
  linked_registrations?: RelationshipWithLinks<'registrations'>;
  logs?: RelationshipWithLinks<'logs'>;
  node_links?: RelationshipWithLinks<'node-links'>;
  parent?: RelationshipWithLinks<'nodes'>;
  preprints?: RelationshipWithLinks<'preprints'>;
  region?: RelationshipWithLinks<'regions'>;
  registrations?: RelationshipWithLinks<'registrations'>;
  root?: RelationshipWithLinks<'nodes'>;
  settings?: RelationshipWithLinks<'node-settings'>;
  storage?: RelationshipWithLinks<'node-storage'>;
  subjects_acceptable?: RelationshipWithLinks<'subjects'>;
  view_only_links?: RelationshipWithLinks<'view-only-links'>;
  wikis?: RelationshipWithLinks<'wikis'>;
}

export interface RelationshipData<T = string> {
  id: string;
  type: T;
}

export interface RelationshipLink {
  href: string;
  meta?: Record<string, unknown>;
}

export interface RelationshipWithLinks<T = string> {
  links: {
    related: RelationshipLink;
    self?: RelationshipLink;
  };
  data?: RelationshipData<T>;
}
