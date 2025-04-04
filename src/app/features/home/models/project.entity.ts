import {BibliographicContributor} from '@osf/features/home/models/bibliographic-contributor.entity';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  dateCreated: Date;
  dateModified: Date;
  fork: boolean;
  tags: string[];
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  public: boolean;
  bibliographicContributors: BibliographicContributor[];
}
