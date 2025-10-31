import { IdTypeModel } from './common/id-type.model';
import { ContributorModel } from './contributors/contributor.model';
import { IdentifierModel } from './identifiers/identifier.model';
import { Institution } from './institutions/institutions.models';
import { LicensesOption } from './license/license.model';
import { SubjectModel } from './subject/subject.model';

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
  identifiers?: IdentifierModel[];
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
  iaUrl?: string | null;
}
