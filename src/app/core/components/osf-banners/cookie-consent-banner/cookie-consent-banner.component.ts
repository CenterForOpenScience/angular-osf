import { CookieService } from 'ngx-cookie-service';
import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { fadeInOutAnimation } from '@core/animations/fade.in-out.animation';

/**
 * Displays a cookie consent banner until the user accepts.
 *
 * - Uses `ngx-cookie-service` to persist acceptance across sessions.
 * - Automatically hides the banner if consent is already recorded.
 * - Animates in/out using the `fadeInOutAnimation`.
 * - Supports translation via `TranslatePipe`.
 */
@Component({
  selector: 'osf-cookie-consent-banner',
  templateUrl: './cookie-consent-banner.component.html',
  styleUrls: ['./cookie-consent-banner.component.scss'],
  imports: [Button, TranslatePipe],
  animations: [fadeInOutAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentBannerComponent {
  /**
   * The name of the cookie used to track whether the user accepted cookies.
   */
  private readonly cookieName = 'cookie-consent';

  /**
   * Signal controlling the visibility of the cookie banner.
   * Set to `true` if the user has not accepted cookies yet.
   */
  readonly displayBanner = signal<boolean>(false);

  /**
   * Cookie service used to persist dismissal state in the browser.
   */
  private readonly cookies = inject(CookieService);

  /**
   * Initializes the component and sets the banner display
   * based on the existence of the cookie.
   */
  constructor() {
    this.displayBanner.set(!this.cookies.check(this.cookieName));
  }

  /**
   * Called when the user accepts cookies.
   * - Sets a persistent cookie with a far-future expiration.
   * - Hides the banner immediately.
   */
  acceptCookies() {
    const expireDate = new Date('9999-12-31T23:59:59Z');
    this.cookies.set(this.cookieName, 'true', expireDate, '/');
    this.displayBanner.set(false);
  }
}
