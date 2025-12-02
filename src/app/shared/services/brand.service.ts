import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { BrandModel } from '../models/brand/brand.model';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  applyBranding(brand: BrandModel): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;

    root.style.setProperty('--branding-primary-color', brand.primaryColor);
    root.style.setProperty('--branding-secondary-color', brand.secondaryColor);
    root.style.setProperty('--branding-background-color', brand.backgroundColor || '');
    root.style.setProperty('--branding-hero-logo-image-url', `url(${brand.topNavLogoImageUrl})`);
    root.style.setProperty('--branding-hero-background-image-url', `url(${brand.heroBackgroundImageUrl})`);
  }

  resetBranding(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;

    root.style.setProperty('--branding-primary-color', '');
    root.style.setProperty('--branding-secondary-color', '');
    root.style.setProperty('--branding-background-color', '');
    root.style.setProperty('--branding-hero-logo-image-url', '');
    root.style.setProperty('--branding-hero-background-image-url', '');
  }
}
