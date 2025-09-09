import { inject, InjectionToken, Provider } from '@angular/core';

import { OSFConfigService } from '@core/services/osf-config.service';

/**
 * Injection token used to provide the Google Tag Manager ID (GTM ID).
 *
 * This token allows the GTM ID to be injected anywhere in the Angular application
 * using Angular's dependency injection system.
 *
 * Example usage:
 * ```ts
 * const gtmId = inject(GOOGLE_TAG_MANAGER_ID);
 * ```
 */
export const GOOGLE_TAG_MANAGER_ID = new InjectionToken<string>('googleTagManagerId');

/**
 * Angular provider that asynchronously retrieves the Google Tag Manager ID from
 * the OSFConfigService and registers it under the `GOOGLE_TAG_MANAGER_ID` token.
 *
 * This provider should be used when the GTM ID is stored in a configuration file
 * loaded at app initialization. It ensures that the ID can be injected and used
 * in components or services after configuration has been loaded.
 *
 * Example:
 * ```ts
 * providers: [GOOGLE_TAG_MANAGER_ID_PROVIDER]
 * ```
 */
export const GOOGLE_TAG_MANAGER_ID_PROVIDER: Provider = {
  provide: GOOGLE_TAG_MANAGER_ID,
  useFactory: async () => {
    const configService = inject(OSFConfigService);
    return await configService.get('googleTagManagerId');
  },
};
