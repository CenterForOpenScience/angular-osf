import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

@Component({
  selector: 'osf-forbidden-page',
  imports: [TranslatePipe],
  templateUrl: './forbidden-page.component.html',
  styleUrl: './forbidden-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenPageComponent {
  private readonly environment = inject(ENVIRONMENT);
  readonly supportEmail = this.environment.supportEmail;
}
