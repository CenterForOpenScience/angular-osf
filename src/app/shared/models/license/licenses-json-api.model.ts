import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';

export type LicensesResponseJsonApi = ListResponse<LicenseDataJsonApi>;
export type LicenseResponseJsonApi = ItemResponse<LicenseDataJsonApi>;

export type LicenseDataJsonApi = JsonApiResource<'licenses', LicenseAttributesJsonApi>;

interface LicenseAttributesJsonApi {
  name: string;
  required_fields: string[];
  text: string;
  url: string;
}

export interface LicenseRecordJsonApi {
  copyright_holders: string[];
  year: string;
}
