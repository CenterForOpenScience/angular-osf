import { Store } from '@ngxs/store';

import { effect, inject, Injectable } from '@angular/core';

import { WINDOW } from '@core/provider/window.provider';
import { UserSelectors } from '@osf/core/store/user';

/**
 * HelpScoutService manages GTM-compatible `dataLayer` state
 * related to user authentication and resource type.
 *
 * This service ensures that specific fields in the global
 * `window.dataLayer` object are set correctly for downstream
 * tools like Google Tag Manager or HelpScout integrations.
 */
@Injectable({
  providedIn: 'root',
})
export class HelpScoutService {
  /**
   * Reference to the global window object, injected via a factory.
   * Used to access and manipulate `dataLayer` for tracking.
   */
  private window = inject(WINDOW);

  /**
   * Angular Store instance used to access application state via NgRx.
   * Injected using Angular's `inject()` function.
   *
   * @private
   * @type {Store}
   */
  private store = inject(Store);

  /**
   * Signal that represents the current authentication state of the user.
   * Derived from the NgRx selector `UserSelectors.isAuthenticated`.
   *
   * Can be used reactively in effects or template bindings to update UI or behavior
   * based on whether the user is logged in.
   *
   * @private
   * @type {Signal<boolean>}
   */
  private isAuthenticated = this.store.selectSignal(UserSelectors.isAuthenticated);

  /**
   * Initializes the `dataLayer` with default values.
   *
   * - `loggedIn`: false
   * - `resourceType`: undefined
   */
  constructor() {
    if (this.window.dataLayer) {
      this.window.dataLayer.loggedIn = false;
      this.window.dataLayer.resourceType = undefined;
    } else {
      this.window.dataLayer = {
        loggedIn: false,
        resourceType: undefined,
      };
    }

    effect(() => {
      this.window.dataLayer.loggedIn = this.isAuthenticated();
    });
  }

  /**
   * Sets the current resource type in the `dataLayer`.
   *
   * @param resourceType - The name of the resource (e.g., 'project', 'node')
   */
  setResourceType(resourceType: string): void {
    this.window.dataLayer.resourceType = resourceType;
  }

  /**
   * Clears the `resourceType` from the `dataLayer`, setting it to `undefined`.
   */
  unsetResourceType(): void {
    this.window.dataLayer.resourceType = undefined;
  }
}
