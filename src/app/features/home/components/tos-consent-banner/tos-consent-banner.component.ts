import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Message } from 'primeng/message';

import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AcceptTermsOfServiceByUser, UserSelectors } from '@core/store/user';
import { IconComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';

@Component({
  selector: 'osf-tos-consent-banner',
  imports: [FormsModule, Checkbox, Button, Message, TranslatePipe, IconComponent, RouterLink],
  templateUrl: './tos-consent-banner.component.html',
  styleUrls: ['./tos-consent-banner.component.scss'],
})
export class TosConsentBannerComponent {
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  readonly actions = createDispatchMap({ acceptTermsOfServiceByUser: AcceptTermsOfServiceByUser });
  readonly currentUser = select(UserSelectors.getCurrentUser);

  acceptedTermsOfService = signal(false);
  errorMessage: string | null = null;

  acceptedTermsOfServiceChange = computed(() => this.currentUser()?.acceptedTermsOfService);

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
