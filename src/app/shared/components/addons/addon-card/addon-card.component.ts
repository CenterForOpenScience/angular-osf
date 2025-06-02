import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Addon, AuthorizedAddon } from '@osf/features/settings/addons/models';
import { DeleteAuthorizedAddon } from '@osf/features/settings/addons/store';
import { IS_XSMALL } from '@shared/utils';

@Component({
  selector: 'osf-addon-card',
  imports: [Button, NgClass, DialogModule, TranslatePipe],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss',
})
export class AddonCardComponent {
  #router = inject(Router);
  #store = inject(Store);
  readonly card = input<Addon | AuthorizedAddon | null>(null);
  readonly cardButtonLabel = input<string>('');
  readonly showDangerButton = input<boolean>(false);
  protected isDialogVisible = signal(false);
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly isDisabling = signal(false);
  protected readonly addonTypeString = computed(() => {
    const addon = this.card();
    if (addon) {
      return addon.type === 'authorized-storage-accounts' ? 'storage' : 'citation';
    }
    return '';
  });

  onConnectAddon(): void {
    const addon = this.card();
    if (addon) {
      this.#router.navigate(['/settings/addons/connect-addon'], {
        state: { addon },
      });
    }
  }

  showDisableDialog(): void {
    this.isDialogVisible.set(true);
  }

  hideDialog(): void {
    if (!this.isDisabling()) {
      this.isDialogVisible.set(false);
    }
  }

  onDisableAddon(): void {
    const addonId = this.card()?.id;
    if (addonId) {
      this.isDisabling.set(true);
      this.#store.dispatch(new DeleteAuthorizedAddon(addonId, this.addonTypeString())).subscribe({
        complete: () => {
          this.isDisabling.set(false);
          this.isDialogVisible.set(false);
        },
        error: () => {
          this.isDisabling.set(false);
        },
      });
    }
  }
}
