import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderStyleService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  applyHeaderStyles(textColor: string, backgroundColor?: string, backgroundImageUrl?: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;

    root.style.setProperty('--header-color', textColor);
    root.style.setProperty('--header-background-color', backgroundColor || '');
    root.style.setProperty('--header-background-image-url', `url(${backgroundImageUrl || ''})`);
  }

  resetToDefaults() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;

    root.style.setProperty('--header-color', '');
    root.style.setProperty('--header-background-color', '');
    root.style.setProperty('--header-background-image-url', '');
  }
}
