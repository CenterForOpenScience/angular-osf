import { Banner, BannerJsonApi } from '../models/banners.model';

export class BannerMapper {
  static fromResponse(response: BannerJsonApi): Banner {
    return {
      id: response.data.id,
      startDate: new Date(response.data.attributes.start_date),
      endDate: new Date(response.data.attributes.end_date),
      color: response.data.attributes.color,
      license: response.data.attributes.license,
      name: response.data.attributes.name,
      defaultAltText: response.data.attributes.default_alt_text,
      mobileAltText: response.data.attributes.mobile_alt_text,
      defaultPhoto: response.data.links.default_photo,
      mobilePhoto: response.data.links.mobile_photo,
    };
  }
}
