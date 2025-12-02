import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { WINDOW } from '@core/provider/window.provider';

@Injectable({ providedIn: 'root' })
export class ViewOnlyService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly window = inject(WINDOW);

  hasViewOnlyParam(router: Router): boolean {
    const currentUrl = router.url;
    const routerParams = new URLSearchParams(currentUrl.split('?')[1] || '');

    if (isPlatformBrowser(this.platformId) && this.window.location?.search) {
      const windowParams = new URLSearchParams(this.window.location.search);
      return routerParams.has('view_only') || windowParams.has('view_only');
    }

    return routerParams.has('view_only');
  }

  getViewOnlyParam(router?: Router): string | null {
    let currentUrl = '';

    if (router) {
      currentUrl = router.url;
    }

    const routerParams = new URLSearchParams(currentUrl.split('?')[1] || '');

    if (isPlatformBrowser(this.platformId) && this.window.location?.search) {
      const windowParams = new URLSearchParams(this.window.location.search);
      return routerParams.get('view_only') || windowParams.get('view_only');
    }

    return routerParams.get('view_only');
  }

  getViewOnlyParamFromUrl(currentUrl?: string): string | null {
    if (!currentUrl) return null;

    const routerParams = new URLSearchParams(currentUrl.split('?')[1] || '');

    if (isPlatformBrowser(this.platformId) && this.window.location?.search) {
      const windowParams = new URLSearchParams(this.window.location.search);
      return routerParams.get('view_only') || windowParams.get('view_only');
    }

    return routerParams.get('view_only');
  }
}
