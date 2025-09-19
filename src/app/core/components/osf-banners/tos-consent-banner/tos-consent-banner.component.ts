import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Message } from 'primeng/message';

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AcceptTermsOfServiceByUser, UserSelectors } from '@core/store/user';
import { IconComponent } from '@osf/shared/components';

/**
 * TosConsentBannerComponent displays a Terms of Service (ToS) consent banner for users who haven't accepted yet.
 * It includes a checkbox, error handling, and dispatches an action to accept the ToS upon confirmation.
 *
 * This component integrates:
 * - PrimeNG UI elements (`Checkbox`, `Button`, `Message`)
 * - i18n translation support
 * - NGXS store selectors and actions
 * - Signal-based reactivity and computed values
 * - Toast notifications for user feedback
 *
 * @component
 * @example
 * <osf-tos-consent-banner></osf-tos-consent-banner>
 */
@Component({
  selector: 'osf-tos-consent-banner',
  imports: [FormsModule, Checkbox, Button, Message, TranslatePipe, IconComponent, RouterLink],
  templateUrl: './tos-consent-banner.component.html',
})
export class TosConsentBannerComponent {
  /**
   * NGXS dispatch map for the AcceptTermsOfServiceByUser action.
   */
  readonly actions = createDispatchMap({ acceptTermsOfServiceByUser: AcceptTermsOfServiceByUser });

  /**
   * Signal of the current user from NGXS UserSelectors.
   */
  readonly currentUser = select(UserSelectors.getCurrentUser);

  /**
   * Local signal tracking whether the user has accepted the Terms of Service via checkbox.
   */
  acceptedTermsOfService = signal(false);

  /**
   * Computed signal indicating whether the user has already accepted the Terms of Service.
   */
  readonly acceptedTermsOfServiceChange = computed(() => {
    const user = this.currentUser();
    return user?.acceptedTermsOfService ?? false;
  });

  /**
   * Triggered when the user clicks the Continue button.
   * - Shows an error toast if checkbox is not checked.
   * - Dispatches `AcceptTermsOfServiceByUser` action otherwise.
   */
  onContinue() {
    this.actions.acceptTermsOfServiceByUser();
  }
}
