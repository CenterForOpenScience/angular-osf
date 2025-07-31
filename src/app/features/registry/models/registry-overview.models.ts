import { ProjectOverviewContributor } from '@osf/features/project/overview/models';
import { RegistrationQuestions, RegistrySubject } from '@osf/features/registry/models';
import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@shared/enums';
import { License } from '@shared/models';

export interface RegistryOverview {
  id: string;
  type: string;
  isPublic: boolean;
  forksCount: number;
  title: string;
  description: string;
  dateModified: string;
  dateCreated: string;
  dateRegistered?: string;
  registrationType: string;
  doi: string;
  tags: string[];
  registry?: string;
  contributors: ProjectOverviewContributor[];
  citation: string;
  category: string;
  isFork: boolean;
  accessRequestsEnabled: boolean;
  nodeLicense?: {
    copyrightHolders: string[];
    year: string;
  };
  license?: License;
  licenseUrl?: string;
  identifiers?: {
    id: string;
    type: string;
    category: string;
    value: string;
  }[];
  analyticsKey: string;
  currentUserCanComment: boolean;
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  region?: {
    id: string;
    type: string;
  };
  subjects?: RegistrySubject[];
  customCitation: string;
  hasData: boolean;
  hasAnalyticCode: boolean;
  hasMaterials: boolean;
  hasPapers: boolean;
  hasSupplements: boolean;
  questions: RegistrationQuestions;
  registrationSchemaLink: string;
  associatedProjectId: string;
  schemaResponses: {
    id: string;
    revisionResponses: RegistrationQuestions;
    updatedResponseKeys: string[];
  }[];
  status: RegistryStatus;
  revisionStatus: RevisionReviewStates;
  reviewsState?: RegistrationReviewStates;
  links: {
    files: string;
  };
}
