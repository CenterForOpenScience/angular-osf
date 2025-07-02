import { License } from '@shared/models/license.model';
import { LicensesResponseJsonApi } from '@shared/models/licenses-json-api.model';

export class LicensesMapper {
  static fromLicensesResponse(response: LicensesResponseJsonApi): License[] {
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      requiredFields: item.attributes.required_fields,
      url: item.attributes.url,
      text: item.attributes.text,
    }));
  }
}
