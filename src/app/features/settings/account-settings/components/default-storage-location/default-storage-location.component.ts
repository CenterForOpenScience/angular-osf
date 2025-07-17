import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { LoaderService, ToastService } from '@osf/shared/services';

import { Region } from '../../models';
import { AccountSettingsSelectors, UpdateRegion } from '../../store';

@Component({
  selector: 'osf-default-storage-location',
  imports: [Button, Card, Select, FormsModule, TranslatePipe],
  templateUrl: './default-storage-location.component.html',
  styleUrl: './default-storage-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultStorageLocationComponent {
  private readonly actions = createDispatchMap({ updateRegion: UpdateRegion });
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

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
      this.loaderService.show();

      this.actions
        .updateRegion(this.selectedRegion()!.id)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe(() =>
          this.toastService.showSuccess('settings.accountSettings.defaultStorageLocation.successUpdate')
        );
    }
  }
}
