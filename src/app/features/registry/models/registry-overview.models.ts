import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RegistryStatus } from '@osf/shared/enums/registry-status.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { IdTypeModel } from '@shared/models/common/id-type.model';
import { MetaJsonApi } from '@shared/models/common/json-api.model';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { IdentifierModel } from '@shared/models/identifiers/identifier.model';
import { LicenseModel, LicensesOption } from '@shared/models/license/license.model';
import { ProviderShortInfoModel } from '@shared/models/provider/provider.model';
import { RegistrationNodeModel, RegistrationResponses } from '@shared/models/registration/registration-node.model';
import { SchemaResponse } from '@shared/models/registration/schema-response.model';
import { SubjectModel } from '@shared/models/subject/subject.model';

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
  contributors: ContributorModel[];
  citation: string;
  category: string;
  isFork: boolean;
  accessRequestsEnabled: boolean;
  nodeLicense?: LicensesOption;
  license?: LicenseModel;
  licenseUrl?: string;
  identifiers?: IdentifierModel[];
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
  questions: RegistrationResponses;
  registrationSchemaLink: string;
  associatedProjectId: string;
  schemaResponses: SchemaResponse[];
  status: RegistryStatus;
  revisionStatus: RevisionReviewStates;
  reviewsState?: RegistrationReviewStates;
  archiving: boolean;
  embargoEndDate: string;
  withdrawn: boolean;
  withdrawalJustification?: string;
  dateWithdrawn: string | null;
  rootParentId: string | null;
  iaUrl: string | null;
}

export interface RegistrationOverviewModel extends RegistrationNodeModel {
  registrationSchemaLink: string;
  licenseId: string;
  associatedProjectId: string;
  providerId: string;
  status: RegistryStatus;
  forksCount: number;
  rootParentId?: string;
}

export interface RegistryOverviewWithMeta {
  registry: RegistrationOverviewModel;
  meta?: MetaJsonApi;
}
