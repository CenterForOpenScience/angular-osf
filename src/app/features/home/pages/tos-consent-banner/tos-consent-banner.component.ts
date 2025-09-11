import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common'; // <-- Import NgIf
import { FormsModule } from '@angular/forms'; // <-- 1. Import this
import { Button, ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import {createDispatchMap} from '@ngxs/store';
import {GetCurrentUserSettings, UpdateUserSettings, GetCurrentUser} from '@core/store/user';
import {
  GetAllGlobalNotificationSubscriptions,
  UpdateNotificationSubscription
} from '@osf/features/settings/notifications/store';


@Component({
  selector: 'cos-tos-consent-banner',
  imports: [NgIf, FormsModule, CheckboxModule, ButtonModule, MessageModule ],
  templateUrl: './tos-consent-banner.component.html',
  styleUrls: ['./tos-consent-banner.component.scss'],
})
export class TosConsentBannerComponent {
  @Input() visible = false;
  @Input() termsLink = '/terms';
  @Input() privacyLink = '/privacy';

  @Input() acceptedTermsOfService = false;
  @Output() acceptedTermsOfServiceChange = new EventEmitter<boolean>();

  @Output() accepted = new EventEmitter<void>();

  errorMessage: string | null = null;

  // private readonly actions = createDispatchMap({
  //   getCurrentUserSettings: GetCurrentUserSettings,
  //   getCurrentUser: GetCurrentUser,
  //   getAllGlobalNotificationSubscriptions: GetAllGlobalNotificationSubscriptions,
  //   updateUserSettings: UpdateUserSettings,
  //   updateNotificationSubscription: UpdateNotificationSubscription,
  // });

  onContinue() {
    // alert(JSON.stringify(this.actions.GetCurrentUser()));

    if (!this.acceptedTermsOfService) {
      this.errorMessage = 'You must agree before continuing.';
      return;
    }

    this.errorMessage = null;

    this.acceptedTermsOfServiceChange.emit(this.acceptedTermsOfService);
    this.accepted.emit();
  }
}
