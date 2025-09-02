import { LicensesOption } from '../license.model';

export interface ActivityLog {
  id: string;
  type: string;
  action: string;
  date: string;
  params: {
    contributors: LogContributor[];
    license?: string;
    tag?: string;
    institution?: {
      id: string;
      name: string;
    };
    paramsNode: {
      id: string;
      title: string;
    };
    paramsProject: null;
    pointer: Pointer | null;
    preprintProvider?:
      | string
      | {
          url: string;
          name: string;
        }
      | null;
    addon?: string;
    anonymousLink?: boolean;
    file?: {
      name: string;
      url: string;
    };
    wiki?: {
      name: string;
      url: string;
    };
    destination?: {
      materialized: string;
      addon: string;
      url: string;
    };
    identifiers?: {
      doi?: string;
      ark?: string;
    };
    kind?: string;
    oldPage?: string;
    page?: string;
    pageId?: string;
    path?: string;
    urls?: {
      view: string;
    };
    preprint?: string;
    source?: {
      materialized: string;
      addon: string;
    };
    titleNew?: string;
    titleOriginal?: string;
    updatedFields?: Record<
      string,
      {
        new: string;
        old: string;
      }
    >;
    value?: string;
    version?: string;
    githubUser?: string;
  };
  embeds?: {
    originalNode?: OriginalNode;
    user?: User;
    linkedNode?: LinkedNode;
  };
  isAnonymous?: boolean;
}

interface Pointer {
  category: string;
  id: string;
  title: string;
  url: string;
}

interface OriginalNode {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  customCitation: string | null;
  dateCreated: string;
  dateModified: string;
  registration: boolean;
  preprint: boolean;
  fork: boolean;
  collection: boolean;
  tags: string[];
  accessRequestsEnabled: boolean;
  nodeLicense: LicensesOption;
  currentUserCanComment: boolean;
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  public: boolean;
  subjects: { id: string; text: string }[][];
}

interface User {
  id: string;
  type: string;
  fullName: string;
  givenName: string;
  middleNames: string;
  familyName: string;
  suffix: string;
  dateRegistered: string;
  active: boolean;
  timezone: string;
  locale: string;
}

interface LinkedNode {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  customCitation: string | null;
  dateCreated: string;
  dateModified: string;
  registration: boolean;
  preprint: boolean;
  fork: boolean;
  collection: boolean;
  tags: string[];
  accessRequestsEnabled: boolean;
  nodeLicense: LicensesOption;
  currentUserCanComment: boolean;
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  public: boolean;
  subjects: { id: string; text: string }[][];
}

export interface LogContributor {
  id: string;
  fullName: string;
  givenName: string;
  middleNames: string;
  familyName: string;
  unregisteredName: string | null;
  active: boolean;
}
