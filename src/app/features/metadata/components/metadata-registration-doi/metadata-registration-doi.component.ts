import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';

@Component({
  selector: 'osf-metadata-registration-doi',
  imports: [Card, TranslatePipe],
  templateUrl: './metadata-registration-doi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataRegistrationDoiComponent {
  identifiers = input<IdentifierModel[]>([]);
  doiHost = 'https://doi.org/';

  registrationDoi = computed(() => (this.identifiers() ? this.doiHost + this.identifiers()[0]?.value : ''));
}
