import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {
  readonly supportEmail = environment.supportEmail;
}
