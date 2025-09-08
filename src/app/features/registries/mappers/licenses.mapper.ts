import { LicenseModel, LicensesResponseJsonApi } from '@osf/shared/models';

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
