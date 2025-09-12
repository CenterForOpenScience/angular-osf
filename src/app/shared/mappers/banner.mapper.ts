import { Banner, BannerJsonApi } from '../models/banners.model';

export class BannerMapper {
  static fromResponse(response: BannerJsonApi): Banner {
    return {
      id: response.id,
      startDate: new Date(response.attributes.start_date),
      endDate: new Date(response.attributes.end_date),
      color: response.attributes.color,
      license: response.attributes.license,
      name: response.attributes.name,
      defaultAltText: response.attributes.default_alt_text,
      mobileAltText: response.attributes.mobile_alt_text,
      defaultPhoto: response.links.default_photo,
      mobilePhoto: response.links.mobile_photo,
      link: response.attributes.link,
    };
  }
}
