import { ApplicabilityStatus, PreregLinkInfo, ReviewsState } from '@osf/features/preprints/enums';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { BooleanOrNull, StringOrNull } from '@osf/shared/helpers/types.helper';
import { EmbedList } from '@osf/shared/models/common/json-api/embeds.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { ContributorDataJsonApi } from '@shared/models/contributors/contributor-response-json-api.model';
import { IdentifiersResponseJsonApi } from '@shared/models/identifiers/identifier-json-api.model';
import { LicenseDataJsonApi, LicenseRecordJsonApi } from '@shared/models/license/licenses-json-api.model';

import { ToOneRelData } from '../common/json-api/relationships.model';

export type PreprintResponseJsonApi = ItemResponse<PreprintDataJsonApi>;
export type PreprintsListResponseJsonApi = ListResponse<PreprintDataJsonApi>;

export type PreprintMetricsResponseJsonApi = PreprintResponseJsonApi & {
  meta: PreprintMetaJsonApi;
};

export interface PreprintDataJsonApi extends JsonApiResource<'preprints', PreprintAttributesJsonApi> {
  relationships: PreprintRelationshipsJsonApi;
  embeds?: PreprintEmbedsJsonApi;
  links?: PreprintLinksJsonApi;
}

export interface PreprintAttributesJsonApi {
  conflict_of_interest_statement: StringOrNull;
  current_user_permissions: UserPermissions[];
  custom_publication_citation: StringOrNull;
  data_links: string[];
  date_created: string;
  date_last_transitioned: Date | null;
  date_modified: string;
  date_published: Date | null;
  date_withdrawn: Date | null;
  default_license_id: string;
  description: string;
  doi: StringOrNull;
  has_coi: BooleanOrNull;
  has_data_links: ApplicabilityStatus | null;
  has_prereg_links: ApplicabilityStatus | null;
  is_latest_version: boolean;
  is_preprint_orphan: boolean;
  is_published: boolean;
  license_record: LicenseRecordJsonApi | null;
  original_publication_date: Date | null;
  prereg_link_info: PreregLinkInfo | null;
  prereg_links: string[];
  preprint_doi_created: Date | null;
  public: boolean;
  reviews_state: ReviewsState;
  tags: string[];
  title: string;
  version: number;
  why_no_data: StringOrNull;
  why_no_prereg: StringOrNull;
  withdrawal_justification: StringOrNull;
}

interface PreprintRelationshipsJsonApi {
  license: ToOneRelData<'licenses'>;
  node: ToOneRelData<'nodes'>;
  primary_file: ToOneRelData<'files'>;
  provider: ToOneRelData<'preprint-providers'>;
}

interface PreprintEmbedsJsonApi {
  bibliographic_contributors?: EmbedList<ContributorDataJsonApi>;
  identifiers?: IdentifiersResponseJsonApi;
  license?: ItemResponse<LicenseDataJsonApi>;
}

interface PreprintMetaJsonApi {
  metrics: {
    downloads: number;
    views: number;
  };
}

interface PreprintLinksJsonApi {
  doi: string;
  preprint_doi: string;
}
