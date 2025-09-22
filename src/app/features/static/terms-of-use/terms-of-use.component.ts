import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

@Component({
  selector: 'osf-terms-of-use',
  imports: [],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfUseComponent {
  private readonly environment = inject(ENVIRONMENT);

  readonly supportEmail = this.environment.supportEmail;
}
