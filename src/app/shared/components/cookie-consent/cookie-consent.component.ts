import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MessageService, PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';

import { AfterViewInit, Component, inject } from '@angular/core';

import { CookieConsentService } from '../../services/cookie-consent/cookie-consent.service';

@Component({
  selector: 'osf-cookie-consent',
  standalone: true,
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
  imports: [Toast, Button, PrimeTemplate, TranslateModule],
})
export class CookieConsentComponent implements AfterViewInit {
  private readonly toastService = inject(MessageService);
  private readonly consentService = inject(CookieConsentService);
  private readonly translateService = inject(TranslateService);

  ngAfterViewInit() {
    if (!this.consentService.hasConsent()) {
      this.translateService.get('toast.cookie-consent.message').subscribe((detail) => {
        queueMicrotask(() =>
          this.toastService.add({
            detail,
            key: 'cookie',
            sticky: true,
            severity: 'warn',
            closable: false,
          })
        );
      });
    }
  }

  acceptCookies() {
    this.consentService.grantConsent();
    this.toastService.clear('cookie');
  }
}
