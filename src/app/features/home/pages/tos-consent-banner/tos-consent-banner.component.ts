import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import {createDispatchMap, Store} from '@ngxs/store';
import {
  UserSelectors,
} from '@core/store/user';

import {  OnInit } from '@angular/core';
import { AcceptTermsOfServiceByUser } from '@osf/core/store/user';


@Component({
  selector: 'cos-tos-consent-banner',
  imports: [NgIf, FormsModule, CheckboxModule, ButtonModule, MessageModule ],
  templateUrl: './tos-consent-banner.component.html',
  styleUrls: ['./tos-consent-banner.component.scss'],
})
export class TosConsentBannerComponent implements OnInit {
  @Input() visible = false;
  @Input() termsLink = '/terms';
  @Input() privacyLink = '/privacy';

  @Input() acceptedTermsOfService = false;
  @Output() acceptedTermsOfServiceChange = new EventEmitter<boolean>();

  @Output() accepted = new EventEmitter<void>();

  errorMessage: string | null = null;

  private readonly store = inject(Store);
  readonly actions = createDispatchMap({ acceptTermsOfServiceByUser: AcceptTermsOfServiceByUser });


  ngOnInit() {
     const currentUser = this.store.selectSnapshot(UserSelectors.getCurrentUser);
     this.acceptedTermsOfServiceChange.emit(currentUser!.acceptedTermsOfService);
     this.accepted.emit();
  }

  onContinue() {
    let currentUser = this.store.selectSnapshot(UserSelectors.getCurrentUser);
    alert(JSON.stringify(currentUser))
    if (!this.acceptedTermsOfService) {
      this.errorMessage = 'You must agree before continuing.';
      return;
    }

    this.errorMessage = null;
    this.actions.acceptTermsOfServiceByUser()

    this.acceptedTermsOfServiceChange.emit(true);
    this.accepted.emit();
  }
}
