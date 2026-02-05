import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RegistryProviderDetails } from '@osf/shared/models/provider/registry-provider.model';

@Component({
  selector: 'osf-metadata-registry-info',
  imports: [Card, TranslatePipe],
  templateUrl: './metadata-registry-info.component.html',
  styleUrl: './metadata-registry-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataRegistryInfoComponent {
  type = input<string | undefined>('');
  provider = input<RegistryProviderDetails | null>();
}
