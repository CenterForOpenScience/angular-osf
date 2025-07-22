import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@core/models';

export interface LicensesResponseJsonApi {
  data: LicenseDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export interface LicenseResponseJsonApi {
  data: LicenseDataJsonApi;
}

export type LicenseDataJsonApi = ApiData<LicenseAttributesJsonApi, null, null, null>;

export interface LicenseAttributesJsonApi {
  name: string;
  required_fields: string[];
  url: string;
  text: string;
}

export interface LicenseRecordJsonApi {
  copyright_holders: string[];
  year: string;
}
