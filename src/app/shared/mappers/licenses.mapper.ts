import { LicenseDataJsonApi, LicenseModel, LicensesResponseJsonApi } from '../models';

export class LicensesMapper {
  static fromLicensesResponse(response: LicensesResponseJsonApi): LicenseModel[] {
    return response.data.map((item) => LicensesMapper.fromLicenseDataJsonApi(item));
  }

  static fromLicenseDataJsonApi(data: LicenseDataJsonApi): LicenseModel {
    return {
      id: data?.id,
      name: data?.attributes?.name,
      requiredFields: data?.attributes?.required_fields,
      url: data?.attributes?.url,
      text: data?.attributes?.text,
    };
  }
}
