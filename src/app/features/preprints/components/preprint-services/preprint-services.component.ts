import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PreprintProviderShortInfo } from '@osf/features/preprints/models';

@Component({
  selector: 'osf-preprint-services',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './preprint-services.component.html',
  styleUrl: './preprint-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintServicesComponent {
  preprintProvidersToAdvertise = input.required<PreprintProviderShortInfo[]>();
}
