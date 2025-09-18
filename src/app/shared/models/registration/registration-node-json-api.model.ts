import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';

import { BaseNodeAttributesJsonApi } from '../nodes';

export interface RegistrationNodeAttributesJsonApi extends BaseNodeAttributesJsonApi {
  archiving: boolean;
  article_doi: string;
  date_registered: string;
  date_withdrawn: string | null;
  embargo_end_date: string | null;
  embargoed: boolean;
  has_analytic_code: boolean;
  has_data: boolean;
  has_materials: boolean;
  has_papers: boolean;
  has_project: boolean;
  has_supplements: boolean;
  ia_url: string | null;
  pending_embargo_approval: boolean;
  pending_embargo_termination_approval: boolean;
  pending_registration_approval: boolean;
  pending_withdrawal: boolean;
  provider_specific_metadata: string[];
  registered_meta: RegisteredMeta;
  registration_responses: RegistrationResponses;
  registration_supplement: string;
  reviews_state: RegistrationReviewStates;
  revision_state: RevisionReviewStates;
  withdrawal_justification: string | null;
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
  file_id: string;
  file_name: string;
  file_urls: FileUrls;
  file_hashes: FileHashes;
}

export interface RegistrationResponses {
  summary: string;
  uploader: RegistrationUploader[];
}
