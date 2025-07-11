import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';

import { Region } from '../../models';
import { AccountSettingsSelectors, UpdateRegion } from '../../store';

@Component({
  selector: 'osf-default-storage-location',
  imports: [Button, Select, FormsModule, TranslatePipe],
  templateUrl: './default-storage-location.component.html',
  styleUrl: './default-storage-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultStorageLocationComponent {
  readonly actions = createDispatchMap({ updateRegion: UpdateRegion });

  protected readonly currentUser = select(UserSelectors.getCurrentUser);
  protected readonly regions = select(AccountSettingsSelectors.getRegions);
  protected selectedRegion = signal<Region | undefined>(undefined);

  constructor() {
    effect(() => {
      const user = this.currentUser();
      const regions = this.regions();
      if (user && regions) {
        const defaultRegion = regions.find((region) => region.id === user.defaultRegionId);
        this.selectedRegion.set(defaultRegion);
      }
    });
  }

  updateLocation(): void {
    if (this.selectedRegion()?.id) {
      this.actions.updateRegion(this.selectedRegion()!.id);
    }
  }
}
