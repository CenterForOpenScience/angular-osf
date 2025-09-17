import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

@Component({
  selector: 'osf-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {
  private readonly environment = inject(ENVIRONMENT);

  readonly supportEmail = this.environment.supportEmail;
}
