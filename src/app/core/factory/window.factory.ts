import { isPlatformBrowser } from '@angular/common';
import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('Global Window Object');

/**
 * A factory function to provide the global `window` object in Angular.
 *
 * This is useful for making Angular applications **Universal-compatible** (i.e., supporting server-side rendering).
 * It conditionally returns the real `window` only when the code is running in the **browser**, not on the server.
 *
 * @param platformId - The Angular platform ID token (injected by Angular) that helps detect the execution environment.
 * @returns The actual `window` object if running in the browser, otherwise a mock object `{}` for SSR environments.
 *
 * @see https://angular.io/api/core/PLATFORM_ID
 * @see https://angular.io/guide/universal
 */
export function windowFactory(platformId: string): Window | object {
  // Check if we're running in the browser (vs server-side)
  if (isPlatformBrowser(platformId)) {
    return window;
  }

  // Return an empty object as a safe fallback during server-side rendering
  return {};
}
