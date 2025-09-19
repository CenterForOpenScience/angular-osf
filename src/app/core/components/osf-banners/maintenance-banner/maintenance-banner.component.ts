import { CookieService } from 'ngx-cookie-service';

import { MessageModule } from 'primeng/message';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { fadeInOutAnimation } from '@core/animations/fade.in-out.animation';

import { MaintenanceModel } from '../models/maintenance.model';
import { MaintenanceService } from '../services/maintenance.service';

/**
 * A banner component that displays a scheduled maintenance message to users.
 *
 * This component checks a cookie to determine whether the user has previously dismissed
 * the banner. If not, it queries the maintenance status from the server and displays
 * the maintenance message if one is active.
 *
 * The component supports animation via `fadeInOutAnimation` and is optimized with `OnPush` change detection.
 *
 * @example
 * ```html
 * <osf-maintenance-banner />
 * ```
 */
@Component({
  selector: 'osf-maintenance-banner',
  imports: [CommonModule, MessageModule],
  templateUrl: './maintenance-banner.component.html',
  styleUrls: ['./maintenance-banner.component.scss'],
  animations: [fadeInOutAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceBannerComponent implements OnInit {
  /**
   * Signal to track whether the user has dismissed the banner.
   */
  dismissed = signal<boolean>(false);

  /**
   * Signal that holds the current maintenance status fetched from the server.
   */
  maintenance = signal<MaintenanceModel | null>(null);

  /**
   * Service used to fetch maintenance status from the backend.
   */
  private readonly maintenanceService = inject(MaintenanceService);

  /**
   * Cookie service used to persist dismissal state in the browser.
   */
  private readonly cookies = inject(CookieService);

  /**
   * The cookie name used to store whether the user dismissed the banner.
   */
  private readonly cookieName = 'osf-maintenance-dismissed';

  /**
   * Duration (in hours) to persist the dismissal cookie.
   */
  private readonly cookieDurationHours = 24;

  /**
   * Lifecycle hook that initializes the component:
   * - Checks if dismissal cookie exists and sets `dismissed`
   * - If not dismissed, triggers a fetch of current maintenance status
   */
  ngOnInit(): void {
    this.dismissed.set(this.cookies.check(this.cookieName));
    if (!this.dismissed()) {
      this.fetchMaintenanceStatus();
    }
  }

  /**
   * Fetches the current maintenance status from the backend via the `MaintenanceService`
   * and sets it to the `maintenance` signal.
   *
   * If no maintenance is active, the signal remains `null`.
   */
  private fetchMaintenanceStatus(): void {
    this.maintenanceService.fetchMaintenanceStatus().subscribe((maintenance: MaintenanceModel | null) => {
      this.maintenance.set(maintenance);
    });
  }

  /**
   * Dismisses the banner:
   * - Sets a cookie to remember dismissal for 24 hours
   * - Updates the `dismissed` and `maintenance` signals
   */
  dismiss(): void {
    this.cookies.set(this.cookieName, '1', this.cookieDurationHours, '/');
    this.dismissed.set(true);
    this.maintenance.set(null);
  }
}
