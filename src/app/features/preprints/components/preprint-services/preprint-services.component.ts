import { TranslateModule } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PreprintProviderToAdvertise } from '@osf/features/preprints/models';

@Component({
  selector: 'osf-preprint-services',
  imports: [TranslateModule],
  templateUrl: './preprint-services.component.html',
  styleUrl: './preprint-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintServicesComponent {
  preprintProvidersToAdvertise = input.required<PreprintProviderToAdvertise[]>();
}
