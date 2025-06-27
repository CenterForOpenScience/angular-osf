import { Brand } from '@shared/models';

export class BrandService {
  static applyBranding(brand: Brand): void {
    const root = document.documentElement;

    root.style.setProperty('--branding-primary-color', brand.primaryColor);
    root.style.setProperty('--branding-secondary-color', brand.secondaryColor);
    root.style.setProperty('--branding-hero-logo-image-url', `url(${brand.topNavLogoImageUrl})`);
    root.style.setProperty('--branding-hero-background-image-url', `url(${brand.heroBackgroundImageUrl})`);
  }

  static resetBranding(): void {
    const root = document.documentElement;

    root.style.setProperty('--branding-primary-color', '');
    root.style.setProperty('--branding-secondary-color', '');
    root.style.setProperty('--branding-hero-logo-image-url', '');
    root.style.setProperty('--branding-hero-background-image-url', '');
  }
}
