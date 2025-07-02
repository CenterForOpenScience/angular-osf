import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';

export interface LicensesResponseJsonApi {
  data: LicenseDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type LicenseDataJsonApi = ApiData<LicenseAttributesJsonApi, null, null, null>;

interface LicenseAttributesJsonApi {
  name: string;
  required_fields: string[];
  url: string;
  text: string;
}
