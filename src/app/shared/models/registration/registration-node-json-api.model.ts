import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

import { BaseNodeAttributesJsonApi } from '../nodes/base-node-attributes-json-api.model';

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
  registered_meta: RegisteredMetaJsonApi;
  registration_responses: RegistrationResponsesJsonApi;
  registration_supplement: string;
  reviews_state: RegistrationReviewStates;
  revision_state: RevisionReviewStates;
  withdrawal_justification: string | null;
  withdrawn: boolean;
}

interface RegisteredMetaExtraJsonApi {
  data: { name: string };
  nodeId: string;
  sha256: string;
  viewUrl: string;
  selectedFileName: string;
}

interface RegisteredMetaFieldJsonApi {
  extra: RegisteredMetaExtraJsonApi[];
  value: string;
}

interface RegisteredMetaJsonApi {
  summary: { extra: string[]; value: string };
  uploader: RegisteredMetaFieldJsonApi;
}

interface FileUrlsJsonApi {
  html: string;
  download: string;
}

interface FileHashesJsonApi {
  sha256: string;
}

interface RegistrationUploaderJsonApi {
  file_id: string;
  file_name: string;
  file_urls: FileUrlsJsonApi;
  file_hashes: FileHashesJsonApi;
}

interface RegistrationResponsesJsonApi {
  summary: string;
  uploader: RegistrationUploaderJsonApi[];
}
