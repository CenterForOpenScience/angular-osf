import { ProjectOverviewContributor } from '@osf/features/project/overview/models';
import { RegistrationQuestions, RegistrySubject } from '@osf/features/registry/models';

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
  contributors: ProjectOverviewContributor[];
  citation: string;
  category: string;
  isFork: boolean;
  accessRequestsEnabled: boolean;
  nodeLicense?: {
    copyrightHolders: string[];
    year: string;
  };
  license?: {
    name: string;
    text: string;
    url: string;
  };
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
  hasData: boolean;
  hasAnalyticCode: boolean;
  hasMaterials: boolean;
  hasPapers: boolean;
  hasSupplements: boolean;
  questions: RegistrationQuestions;
  registrationSchemaLink: string;
  associatedProjectId: string;
}
