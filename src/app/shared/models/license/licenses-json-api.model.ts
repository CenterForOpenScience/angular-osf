import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '../common/json-api.model';

export interface LicensesResponseJsonApi {
  data: LicenseDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export interface LicenseResponseJsonApi {
  data: LicenseDataJsonApi;
}

export interface ProviderDefaultLicenseAttributesJsonApi {
  default_license_id: string;
}

export interface ProviderDefaultLicenseResponseJsonApi {
  data: ProviderDefaultLicenseDataJsonApi;
}

export type LicenseDataJsonApi = ApiData<LicenseAttributesJsonApi, null, null, null>;

export type ProviderDefaultLicenseDataJsonApi = ApiData<ProviderDefaultLicenseAttributesJsonApi, null, null, null>;

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
