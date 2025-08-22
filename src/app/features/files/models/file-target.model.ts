export interface OsfFileTarget {
  id: string;
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
  nodeLicense: string | null;
  analyticsKey: string;
  currentUserCanComment: boolean;
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  public: boolean;
  type: string;
}
