import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private consentKey = 'cookie-consent';

  hasConsent(): boolean {
    return localStorage.getItem(this.consentKey) === 'true';
  }

  grantConsent() {
    localStorage.setItem(this.consentKey, 'true');
  }

  revokeConsent() {
    localStorage.removeItem(this.consentKey);
  }
}
