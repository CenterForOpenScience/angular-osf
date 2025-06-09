import { Brand } from '@osf/features/preprints/models';

export class BrandService {
  static applyBranding(brand: Brand): void {
    const root = document.documentElement;

    root.style.setProperty('--preprints-branding-primary-color', brand.primaryColor);
    root.style.setProperty('--preprints-branding-secondary-color', brand.secondaryColor);
    root.style.setProperty('--preprints-branding-hero-logo-image-url', `url(${brand.topNavLogoImageUrl})`);
    root.style.setProperty('--preprints-branding-hero-background-image-url', `url(${brand.heroBackgroundImageUrl})`);
  }

  static resetBranding(): void {
    const root = document.documentElement;

    root.style.setProperty('--preprints-branding-primary-color', '');
    root.style.setProperty('--preprints-branding-secondary-color', '');
    root.style.setProperty('--preprints-branding-hero-logo-image-url', '');
    root.style.setProperty('--preprints-branding-hero-background-image-url', '');
  }
}
