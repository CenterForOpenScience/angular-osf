import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

@Component({
  selector: 'osf-page-not-found',
  imports: [TranslatePipe],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
  private readonly environment = inject(ENVIRONMENT);
  readonly supportEmail = this.environment.supportEmail;
}
