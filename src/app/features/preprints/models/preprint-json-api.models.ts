import { BooleanOrNull, StringOrNull } from '@core/helpers';
import { ApplicabilityStatus, PreregLinkInfo } from '@osf/features/preprints/enums';
import { LicenseRecordJsonApi } from '@shared/models';

export interface PreprintJsonApi {
  date_created: string;
  date_modified: string;
  date_published: Date | null;
  original_publication_date: Date | null;
  custom_publication_citation: StringOrNull;
  doi: StringOrNull;
  preprint_doi_created: Date | null;
  title: string;
  description: string;
  is_published: boolean;
  is_preprint_orphan: boolean;
  license_record: LicenseRecordJsonApi | null;
  tags: string[];
  date_withdrawn: Date | null;
  current_user_permissions: string[];
  public: boolean;
  reviews_state: string;
  date_last_transitioned: Date | null;
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

export interface PreprintsRelationshipsJsonApi {
  primary_file: {
    links: {
      related: {
        href: string;
      };
    };
  };
  license: {
    data: {
      id: string;
      type: 'licenses';
    };
  };
}
