import { createDispatchMap, select } from '@ngxs/store';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';

import { Component, computed, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { AcceptTermsOfServiceByUser } from '@osf/core/store/user';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'osf-tos-consent-banner',
  imports: [FormsModule, CheckboxModule, ButtonModule, MessageModule, TranslateModule],
  templateUrl: './tos-consent-banner.component.html',
  styleUrls: ['./tos-consent-banner.component.scss'],
})
export class TosConsentBannerComponent {

  @Input() acceptedTermsOfService = false;

  errorMessage: string | null = null;

  readonly actions = createDispatchMap({ acceptTermsOfServiceByUser: AcceptTermsOfServiceByUser });
  readonly currentUser = select(UserSelectors.getCurrentUser);
  acceptedTermsOfServiceChange = computed(() => {
    return this.currentUser()?.acceptedTermsOfService;
  });

  onContinue() {
    if (!this.acceptedTermsOfService) {
      this.errorMessage = 'We were unable to save your consent.';
      return;
    }

    this.errorMessage = null;
    this.actions.acceptTermsOfServiceByUser();
  }
}
