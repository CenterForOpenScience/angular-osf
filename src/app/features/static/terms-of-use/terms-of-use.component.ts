import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-terms-of-use',
  imports: [],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfUseComponent {
  readonly supportEmail = environment.supportEmail;
}
