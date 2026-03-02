import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

@Component({
  selector: 'osf-resource-is-spammed',
  imports: [TranslatePipe],
  templateUrl: './resource-is-spammed.component.html',
  styleUrl: './resource-is-spammed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceIsSpammedComponent {
  private readonly environment = inject(ENVIRONMENT);
  readonly supportEmail = this.environment.supportEmail;
}
