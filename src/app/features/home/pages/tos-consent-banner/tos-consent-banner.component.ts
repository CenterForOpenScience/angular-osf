import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
import { NgIf } from '@angular/common'; // <-- Import NgIf
import { FormsModule } from '@angular/forms'; // <-- 1. Import this
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import {Store} from '@ngxs/store';
import {GetCurrentUserSettings, UpdateUserSettings, GetCurrentUser, UserSelectors} from '@core/store/user';

import {  OnInit } from '@angular/core';


@Component({
  selector: 'cos-tos-consent-banner',
  imports: [NgIf, FormsModule, CheckboxModule, ButtonModule, MessageModule ],
  templateUrl: './tos-consent-banner.component.html',
  styleUrls: ['./tos-consent-banner.component.scss'],
})
export class TosConsentBannerComponent implements OnInit {
  @Input() termsLink = '/terms';
  @Input() privacyLink = '/privacy';

  @Input() acceptedTermsOfService = false;
  @Output() acceptedTermsOfServiceChange = new EventEmitter<boolean>();

  @Output() accepted = new EventEmitter<void>();

  errorMessage: string | null = null;

  private readonly store = inject(Store);


  ngOnInit() {
     const currentUser = this.store.selectSnapshot(UserSelectors.getCurrentUser);
     this.acceptedTermsOfServiceChange.emit(currentUser!.acceptedTermsOfService);
     this.accepted.emit();
  }

  onContinue() {
    if (!this.acceptedTermsOfService) {
      this.errorMessage = 'You must agree before continuing.';
      return;
    }

    this.errorMessage = null;

    this.acceptedTermsOfServiceChange.emit(this.acceptedTermsOfService);
    this.accepted.emit();
  }
}
