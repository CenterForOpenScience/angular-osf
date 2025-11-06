import { LicenseModel } from '@osf/shared/models/license/license.model';
import { LicensesResponseJsonApi } from '@osf/shared/models/license/licenses-json-api.model';

export class LicensesMapper {
  static fromLicensesResponse(response: LicensesResponseJsonApi): LicenseModel[] {
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      requiredFields: item.attributes.required_fields,
      url: item.attributes.url,
      text: item.attributes.text,
    }));
  }
}
