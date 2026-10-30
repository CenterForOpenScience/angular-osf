import { CookieService } from 'ngx-cookie-service';

import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly cookies = inject(CookieService);
  private readonly cookieName = 'cookie-consent';

  hasConsent(): boolean {
    return this.cookies.check(this.cookieName);
  }

  accept(): void {
    this.cookies.set(this.cookieName, 'true', new Date('9999-12-31T23:59:59Z'), '/');
  }
}
