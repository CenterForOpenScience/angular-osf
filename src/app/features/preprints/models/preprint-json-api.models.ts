import { UserPermissions } from '@osf/shared/enums';
import { BooleanOrNull, StringOrNull } from '@osf/shared/helpers';
import { ContributorDataJsonApi, LicenseRecordJsonApi, LicenseResponseJsonApi } from '@osf/shared/models';

import { ApplicabilityStatus, PreregLinkInfo, ReviewsState } from '../enums';

export interface PreprintAttributesJsonApi {
  date_created: string;
  date_modified: string;
  date_published: Date | null;
  original_publication_date: Date | null;
  date_last_transitioned: Date | null;
  date_withdrawn: Date | null;
  withdrawal_justification: StringOrNull;
  custom_publication_citation: StringOrNull;
  doi: StringOrNull;
  preprint_doi_created: Date | null;
  title: string;
  description: string;
  is_published: boolean;
  is_preprint_orphan: boolean;
  license_record: LicenseRecordJsonApi | null;
  tags: string[];
  current_user_permissions: UserPermissions[];
  public: boolean;
  reviews_state: ReviewsState;
  version: number;
  is_latest_version: boolean;
  has_coi: BooleanOrNull;
  conflict_of_interest_statement: StringOrNull;
  has_data_links: ApplicabilityStatus | null;
  data_links: string[];
  why_no_data: StringOrNull;
  has_prereg_links: ApplicabilityStatus | null;
  why_no_prereg: StringOrNull;
  prereg_links: string[];
  prereg_link_info: PreregLinkInfo | null;
}

export interface PreprintRelationshipsJsonApi {
  primary_file: {
    data: {
      id: string;
      type: 'files';
    };
  };
  license: {
    data: {
      id: string;
      type: 'licenses';
    };
  };
  node: {
    data: {
      id: string;
      type: 'nodes';
    };
  };
  provider: {
    data: {
      id: string;
      type: 'preprint-providers';
    };
  };
}

export interface PreprintEmbedsJsonApi {
  bibliographic_contributors: {
    data: ContributorDataJsonApi[];
  };
  license: LicenseResponseJsonApi;
  identifiers: {
    data: {
      id: string;
      type: string;
      attributes: {
        category: string;
        value: string;
      };
    }[];
  };
}

export interface PreprintMetaJsonApi {
  metrics: {
    downloads: number;
    views: number;
  };
}

export interface PreprintLinksJsonApi {
  preprint_doi: string;
  doi: string;
}
