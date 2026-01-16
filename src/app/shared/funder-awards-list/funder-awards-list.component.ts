import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GetCustomItemMetadata, MetadataSelectors } from '@osf/features/metadata/store';

@Component({
  selector: 'osf-funder-awards-list',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './funder-awards-list.component.html',
  styleUrl: './funder-awards-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunderAwardsListComponent {
  registryId = input<string | null>(null);
  private store = inject(Store);
  customItemMetadata = this.store.selectSignal(MetadataSelectors.getCustomItemMetadata);

  constructor() {
    effect(() => {
      const registryId = this.registryId();
      if (registryId) {
        this.store.dispatch(new GetCustomItemMetadata(registryId));
      }
    });
  }
}
