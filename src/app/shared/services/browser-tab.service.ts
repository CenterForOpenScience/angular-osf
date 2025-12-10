import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BrowserTabService {
  private static readonly DEFAULT_FAVICON = '/favicon.ico';
  private static readonly DEFAULT_TITLE = 'OSF';

  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  updateTabStyles(faviconUrl: string, title: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (faviconUrl) {
      const faviconElement = this.document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (faviconElement) {
        faviconElement.href = faviconUrl;
      }
    }

    if (title) {
      this.document.title = title;
    }
  }

  resetToDefaults() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const faviconElement = this.document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (faviconElement) {
      faviconElement.href = BrowserTabService.DEFAULT_FAVICON;
    }

    this.document.title = BrowserTabService.DEFAULT_TITLE;
  }
}
