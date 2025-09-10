import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common'; // <-- Import NgIf
import { FormsModule } from '@angular/forms'; // <-- 1. Import this


@Component({
  selector: 'app-tos-consent-banner',
  imports: [NgIf, FormsModule],
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
