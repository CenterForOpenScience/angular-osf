import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MaintenanceBannerComponent } from './maintenance-banner/maintenance-banner.component';

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
  imports: [MaintenanceBannerComponent],
  templateUrl: './osf-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OSFBannerComponent {}
