import { ApiData, Education, Employment } from '@osf/shared/models';

export type ContributorResponse = ApiData<ContributorAttributes, ContributorEmbeds, ContributorRelationships, null>;

export interface ContributorAttributes {
  index: number;
  bibliographic: boolean;
  permission: string;
  unregistered_contributor: string | null;
  is_curator: boolean;
}

export interface ContributorRelationships {
  users: Relationship<UserRelationshipData>;
  node: Relationship<NodeRelationshipData>;
}

export interface ContributorEmbeds {
  users: EmbeddedUser;
}

export interface ContributorAddRequestModel {
  type: 'contributors';
  attributes: {
    bibliographic: boolean;
    permission: string;
    id?: string;
    full_name?: string;
    email?: string;
  };
  relationships: {
    users?: {
      data?: RelationshipUsersData;
    };
  };
}

interface RelationshipUsersData {
  id?: string;
  type?: 'users';
}

interface EmbeddedUser {
  data: User;
}

interface User {
  id: string;
  type: string;
  attributes: UserAttributes;
  relationships: UserRelationships;
  links: UserLinks;
}

interface UserAttributes {
  full_name: string;
  given_name: string;
  middle_names: string;
  family_name: string;
  suffix: string;
  date_registered: string;
  active: boolean;
  timezone: string;
  locale: string;
  social: Social;
  employment: Employment[];
  education: Education[];
  allow_indexing: boolean;
  can_view_reviews: [];
  accepted_terms_of_service: boolean;
  email: string;
}

interface Social {
  orcid: string;
  github: string;
  scholar: string;
  twitter: string;
  linkedIn: string;
  impactStory: string;
  researcherId: string;
}

interface UserRelationships {
  nodes: Relationship<null>;
  groups: Relationship<null>;
  registrations: Relationship<null>;
  institutions: Relationship<null>;
  preprints: Relationship<null>;
  draft_preprints: Relationship<null>;
  emails: Relationship<null>;
  default_region: Relationship<DefaultRegionData>;
  settings: Relationship<UserSettingsData>;
}

interface DefaultRegionData {
  id: string;
  type: string;
}

interface UserSettingsData {
  id: string;
  type: string;
}

interface Relationship<T> {
  links: {
    related: LinkWithMeta;
    self?: LinkWithMeta;
  };
  data?: T | null;
}

interface LinkWithMeta {
  href: string;
  meta: Record<string, unknown>;
}

interface UserRelationshipData {
  id: string;
  type: string;
}

interface NodeRelationshipData {
  id: string;
  type: string;
}

interface UserLinks {
  html: string;
  profile_image: string;
  self: string;
  iri: string;
}
