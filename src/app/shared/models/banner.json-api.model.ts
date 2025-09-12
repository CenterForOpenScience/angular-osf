export interface BannerJsonApi {
  id: string;
  attributes: {
    start_date: string;
    end_date: string;
    color: string;
    license: string;
    name: string;
    default_alt_text: string;
    mobile_alt_text: string;
    link: string;
  };
  links: {
    default_photo: string;
    mobile_photo: string;
  };
  type: string;
}
