import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CookieConsentBannerComponent } from './cookie-consent-banner/cookie-consent-banner.component';
import { MaintenanceBannerComponent } from './maintenance-banner/maintenance-banner.component';
import { ScheduledBannerComponent } from './scheduled-banner/scheduled-banner.component';
import { TosConsentBannerComponent } from './tos-consent-banner/tos-consent-banner.component';

/**
 * Wrapper component responsible for rendering all global or conditional banners.
 *
 * Currently, it includes the `MaintenanceBannerComponent`, which displays scheduled
 * maintenance notices based on server configuration and cookie state.
 *
 * This component is structured to allow future expansion for additional banners (e.g., announcements, alerts).
 *
 * Change detection is set to `OnPush` to improve performance.
 *
 * @example
 * ```html
 * <osf-banner-component />
 * ```
 */
@Component({
  selector: 'osf-banner-component',
  imports: [
    MaintenanceBannerComponent,
    ScheduledBannerComponent,
    CookieConsentBannerComponent,
    TosConsentBannerComponent,
  ],
  templateUrl: './osf-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OSFBannerComponent {}
