import { IdTypeModel } from './common';
import { ContributorModel } from './contributors';
import { Identifier } from './identifiers';
import { Institution } from './institutions';
import { LicensesOption } from './license.model';
import { SubjectModel } from './subject';

export interface ResourceOverview {
  id: string;
  type: string;
  title: string;
  description: string;
  dateModified: string;
  dateCreated: string;
  dateRegistered?: string;
  isPublic: boolean;
  category: string;
  isRegistration: boolean;
  isPreprint: boolean;
  isFork: boolean;
  isCollection: boolean;
  tags: string[];
  accessRequestsEnabled: boolean;
  nodeLicense?: LicensesOption;
  license?: {
    name: string;
    text: string;
    url: string;
  };
  storage?: {
    id: string;
    type: string;
    storageLimitStatus: string;
    storageUsage: string;
  };
  identifiers?: Identifier[];
  supplements?: {
    id: string;
    type: string;
    title: string;
    dateCreated: string;
    url: string;
  }[];
  registrationType?: string;
  analyticsKey: string;
  currentUserCanComment: boolean;
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  subjects: SubjectModel[];
  contributors: ContributorModel[];
  customCitation: string | null;
  region?: IdTypeModel;
  affiliatedInstitutions?: Institution[];
  forksCount: number;
  viewOnlyLinksCount?: number;
  associatedProjectId?: string;
  isAnonymous?: boolean;
}
