import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';

import { CookieConsentService } from '@core/services/cookie-consent.service';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

/**
 * Displays a cookie consent banner until the user accepts.
 *
 * - Persists acceptance through `CookieConsentService`.
 * - Automatically hides the banner if consent is already recorded.
 * - Supports translation via `TranslatePipe`.
 */
@Component({
  selector: 'osf-cookie-consent-banner',
  templateUrl: './cookie-consent-banner.component.html',
  styleUrls: ['./cookie-consent-banner.component.scss'],
  imports: [Button, TranslatePipe, IconComponent, Message],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentBannerComponent {
  /**
   * Signal controlling the visibility of the cookie banner.
   * Set to `true` if the user has not accepted cookies yet.
   */
  readonly displayBanner = signal<boolean>(false);

  private readonly cookieConsent = inject(CookieConsentService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Initializes the component and sets the banner display
   * based on the existence of the cookie.
   */
  constructor() {
    if (this.isBrowser) {
      this.displayBanner.set(!this.cookieConsent.hasConsent());
    }
  }

  /**
   * Called when the user accepts cookies.
   * - Sets a persistent cookie with a far-future expiration.
   * - Hides the banner immediately.
   */
  acceptCookies() {
    this.cookieConsent.accept();
    this.displayBanner.set(false);
  }
}
