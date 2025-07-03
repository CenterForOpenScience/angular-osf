import { StringOrNull } from '@core/helpers';
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
  has_coi: boolean;
  conflict_of_interest_statement: StringOrNull;
  has_data_links: boolean;
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
