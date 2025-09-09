export interface Banner {
  id: string;
  startDate: Date;
  endDate: Date;
  color: string;
  license: string;
  name: string;
  defaultAltText: string;
  mobileAltText: string;
  defaultPhoto: string;
  mobilePhoto: string;
}

export interface BannerJsonApi {
  data: {
    id: string;
    attributes: {
      start_date: string;
      end_date: string;
      color: string;
      license: string;
      name: string;
      default_alt_text: string;
      mobile_alt_text: string;
    };
    links: {
      default_photo: string;
      mobile_photo: string;
    };
    type: string;
  };
}
