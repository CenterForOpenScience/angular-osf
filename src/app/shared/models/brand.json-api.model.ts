export interface BrandDataJsonApi {
  id: string;
  type: 'brands';
  attributes: {
    name: string;
    hero_logo_image: string;
    hero_background_image: string;
    topnav_logo_image: string;
    primary_color: string;
    secondary_color: string;
    background_color: string;
  };
}
