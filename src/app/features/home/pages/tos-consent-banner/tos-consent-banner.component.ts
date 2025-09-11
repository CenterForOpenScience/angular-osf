import { createDispatchMap, select } from '@ngxs/store';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';

import { NgIf } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { AcceptTermsOfServiceByUser } from '@osf/core/store/user';

@Component({
  selector: 'osf-tos-consent-banner',
  imports: [NgIf, FormsModule, CheckboxModule, ButtonModule, MessageModule],
  templateUrl: './tos-consent-banner.component.html',
  styleUrls: ['./tos-consent-banner.component.scss'],
})
export class TosConsentBannerComponent {
  @Input() visible = false;
  @Input() termsLink = '/terms';
  @Input() privacyLink = '/privacy';

  @Input() acceptedTermsOfService = false;

  errorMessage: string | null = null;

  readonly actions = createDispatchMap({ acceptTermsOfServiceByUser: AcceptTermsOfServiceByUser });
  readonly currentUser = select(UserSelectors.getCurrentUser);
  acceptedTermsOfServiceChange = computed(() => {
    return this.currentUser()?.acceptedTermsOfService;
  });

  onContinue() {
    if (!this.acceptedTermsOfService) {
      this.errorMessage = 'You must agree before continuing.';
      return;
    }

    this.errorMessage = null;
    this.actions.acceptTermsOfServiceByUser();
  }
}
