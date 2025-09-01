import { RegistryStatus, RevisionReviewStates } from '@osf/shared/enums';

import { IdTypeModel } from '../common';
import { ContributorModel } from '../contributors';
import { LicensesOption } from '../license.model';
import { SubjectModel } from '../subject';

export type RegistrationQuestions = Record<string, string | string[] | { file_id: string; file_name: string }[]>;

export interface RegistrationModel {
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
  contributors: ContributorModel[];
  citation: string;
  category: string;
  isFork: boolean;
  accessRequestsEnabled: boolean;
  nodeLicense?: LicensesOption;
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
  region?: IdTypeModel;
  subjects?: SubjectModel[];
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
}
