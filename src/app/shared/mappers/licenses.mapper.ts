import { License } from '@shared/models/license.model';
import { LicenseDataJsonApi, LicensesResponseJsonApi } from '@shared/models/licenses-json-api.model';

export class LicensesMapper {
  static fromLicensesResponse(response: LicensesResponseJsonApi): License[] {
    return response.data.map((item) => LicensesMapper.fromLicenseDataJsonApi(item));
  }

  static fromLicenseDataJsonApi(data: LicenseDataJsonApi): License {
    return {
      id: data.id,
      name: data.attributes.name,
      requiredFields: data.attributes.required_fields,
      url: data.attributes.url,
      text: data.attributes.text,
    };
  }
}
