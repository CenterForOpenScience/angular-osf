import { License, LicensesResponseJsonApi } from '../models';

export class LicensesMapper {
  static fromLicensesResponse(response: LicensesResponseJsonApi): License[] {
    console.log('LicensesMapper.fromLicensesResponse', response);
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      requiredFields: item.attributes.required_fields,
      url: item.attributes.url,
      text: item.attributes.text,
    }));
  }
}
