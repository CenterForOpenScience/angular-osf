import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

import { BaseNodeModel } from '../nodes/base-node.model';

export interface RegistrationNodeModel extends BaseNodeModel {
  archiving: boolean;
  articleDoi: string;
  dateRegistered: string;
  dateWithdrawn: string | null;
  embargoEndDate: string | null;
  embargoed: boolean;
  hasAnalyticCode: boolean;
  hasData: boolean;
  hasMaterials: boolean;
  hasPapers: boolean;
  hasProject: boolean;
  hasSupplements: boolean;
  iaUrl: string | null;
  pendingEmbargoApproval: boolean;
  pendingEmbargoTerminationApproval: boolean;
  pendingRegistrationApproval: boolean;
  pendingWithdrawal: boolean;
  providerSpecificMetadata: string[];
  registeredMeta: RegisteredMeta;
  registrationResponses: RegistrationResponses;
  registrationSupplement: string;
  reviewsState: RegistrationReviewStates;
  revisionState: RevisionReviewStates;
  withdrawalJustification: string | null;
  withdrawn: boolean;
}

export interface RegisteredMetaExtra {
  data: { name: string };
  nodeId: string;
  sha256: string;
  viewUrl: string;
  selectedFileName: string;
}

export interface RegisteredMetaField {
  extra: RegisteredMetaExtra[];
  value: string;
}

export interface RegisteredMeta {
  summary: { extra: string[]; value: string };
  uploader: RegisteredMetaField;
}

export interface FileUrls {
  html: string;
  download: string;
}

export interface FileHashes {
  sha256: string;
}

export interface RegistrationUploader {
  fileId: string;
  fileName: string;
  fileUrls: FileUrls;
  fileHashes: FileHashes;
}

export interface RegistrationResponses {
  summary: string;
  uploader: RegistrationUploader[];
}
