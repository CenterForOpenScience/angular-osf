import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

/**
 * `WINDOW` is an Angular InjectionToken that provides access to the global `window` object,
 * but only when running in the browser (never on the server).
 *
 * This makes Angular Universal (SSR) safe by returning a mock object `{}` during server-side rendering.
 *
 * @example
 * ```ts
 * const win = inject(WINDOW);
 * win.localStorage.getItem('token');
 * ```
 */
export const WINDOW = new InjectionToken<Window | object>('Global Window Object', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId) ? window : {};
  },
});
