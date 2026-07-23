import { ToManyRel, ToOneRel } from '../common/json-api/relationships.model';

export interface BaseNodeRelationships {
  affiliated_institutions?: ToManyRel<'institutions'>;
  bibliographic_contributors?: ToManyRel<'contributors'>;
  cedar_metadata_records?: ToManyRel<'cedar-metadata-records'>;
  children?: ToManyRel<'nodes'>;
  citation?: ToManyRel<'citations'>;
  comments?: ToManyRel<'comments'>;
  contributors?: ToManyRel<'contributors'>;
  draft_registrations?: ToManyRel<'draft-registrations'>;
  files?: ToManyRel<'files'>;
  forks?: ToManyRel<'nodes'>;
  groups?: ToManyRel<'groups'>;
  identifiers?: ToManyRel<'identifiers'>;
  implicit_contributors?: ToManyRel<'contributors'>;
  license?: ToOneRel<'licenses'>;
  linked_by_nodes?: ToManyRel<'nodes'>;
  linked_by_registrations?: ToManyRel<'registrations'>;
  linked_nodes?: ToManyRel<'nodes'>;
  linked_registrations?: ToManyRel<'registrations'>;
  logs?: ToManyRel<'logs'>;
  node_links?: ToManyRel<'node-links'>;
  parent?: ToOneRel<'nodes'>;
  preprints?: ToManyRel<'preprints'>;
  region?: ToOneRel<'regions'>;
  registrations?: ToManyRel<'registrations'>;
  root?: ToOneRel<'nodes'>;
  settings?: ToOneRel<'node-settings'>;
  storage?: ToOneRel<'node-storage'>;
  subjects_acceptable?: ToManyRel<'subjects'>;
  view_only_links?: ToManyRel<'view-only-links'>;
  wikis?: ToManyRel<'wikis'>;
}
