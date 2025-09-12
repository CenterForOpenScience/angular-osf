import { createDispatchMap, select } from '@ngxs/store';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';

import {Component, computed, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { AcceptTermsOfServiceByUser } from '@osf/core/store/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@osf/shared/services'


@Component({
  selector: 'osf-tos-consent-banner',
  imports: [FormsModule, CheckboxModule, ButtonModule, MessageModule, TranslateModule],
  templateUrl: './tos-consent-banner.component.html',
  styleUrls: ['./tos-consent-banner.component.scss'],
})
export class TosConsentBannerComponent {
  acceptedTermsOfService = signal(false);
  errorMessage: string | null = null;

  readonly actions = createDispatchMap({ acceptTermsOfServiceByUser: AcceptTermsOfServiceByUser });
  readonly currentUser = select(UserSelectors.getCurrentUser);
  acceptedTermsOfServiceChange = computed(() => {
    return this.currentUser()?.acceptedTermsOfService;
  });

  private readonly toastService = inject(ToastService);

  private translateService = inject(TranslateService);

  onContinue() {

    if (!this.acceptedTermsOfService()) {
      this.errorMessage = this.translateService.instant('toast.tos-consent.error-message');
      this.toastService.showError(this.errorMessage as string);
      return;
    }

    this.errorMessage = null;
    this.actions.acceptTermsOfServiceByUser();
  }
}
