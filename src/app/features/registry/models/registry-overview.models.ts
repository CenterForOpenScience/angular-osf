import { ProjectOverviewContributor } from '@osf/features/project/overview/models';
import { RegistrationQuestions } from '@osf/features/registry/models';
import {
  IdTypeModel,
  LicenseModel,
  LicensesOption,
  MetaAnonymousJsonApi,
  ProviderShortInfoModel,
  SchemaResponse,
  SubjectModel,
} from '@osf/shared/models';
import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates, UserPermissions } from '@shared/enums';

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
  provider?: ProviderShortInfoModel;
  contributors: ProjectOverviewContributor[];
  citation: string;
  category: string;
  isFork: boolean;
  accessRequestsEnabled: boolean;
  nodeLicense?: LicensesOption;
  license?: LicenseModel;
  licenseUrl?: string;
  identifiers?: {
    id: string;
    type: string;
    category: string;
    value: string;
  }[];
  analyticsKey: string;
  currentUserCanComment: boolean;
  currentUserPermissions: UserPermissions[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  region?: IdTypeModel;
  subjects?: SubjectModel[];
  customCitation: string;
  hasData: boolean;
  hasAnalyticCode: boolean;
  hasMaterials: boolean;
  hasPapers: boolean;
  hasSupplements: boolean;
  questions: RegistrationQuestions;
  registrationSchemaLink: string;
  associatedProjectId: string;
  schemaResponses: SchemaResponse[];
  status: RegistryStatus;
  revisionStatus: RevisionReviewStates;
  reviewsState?: RegistrationReviewStates;
  links: {
    files: string;
  };
  archiving: boolean;
  embargoEndDate: string;
  currentUserIsModerator: boolean;
  withdrawn: boolean;
  withdrawalJustification?: string;
  dateWithdrawn: string | null;
}

export interface RegistryOverviewWithMeta {
  registry: RegistryOverview | null;
  meta?: MetaAnonymousJsonApi;
}
