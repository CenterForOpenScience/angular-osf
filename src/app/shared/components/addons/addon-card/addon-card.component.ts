import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Addon, AuthorizedAddon, ConfiguredAddon } from '@shared/models';
import { DeleteAuthorizedAddon } from '@shared/stores/addons';
import { IS_XSMALL } from '@shared/utils';

@Component({
  selector: 'osf-addon-card',
  imports: [Button, NgClass, DialogModule, TranslatePipe],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss',
})
export class AddonCardComponent {
  private router = inject(Router);
  private store = inject(Store);
  readonly card = input<Addon | AuthorizedAddon | ConfiguredAddon | null>(null);
  readonly cardButtonLabel = input<string>('');
  readonly showDangerButton = input<boolean>(false);
  protected isDialogVisible = signal(false);
  protected readonly isMobile = toSignal(inject(IS_XSMALL));
  protected readonly isDisabling = signal(false);
  protected readonly addonTypeString = computed(() => {
    const addon = this.card();
    if (addon) {
      return addon.type === 'authorized-storage-accounts' || addon.type === 'configured-storage-addons'
        ? 'storage'
        : 'citation';
    }
    return '';
  });
  protected readonly isConfiguredAddon = computed(() => {
    const addon = this.card();
    if (addon) {
      return addon.type === 'configured-storage-addons' || addon.type === 'configured-citation-addons';
    }

    return false;
  });

  onConnectAddon(): void {
    const addon = this.card();
    if (addon) {
      const currentUrl = this.router.url;
      const baseUrl = currentUrl.split('/addons')[0];
      this.router.navigate([`${baseUrl}/addons/connect-addon`], {
        state: { addon },
      });
    }
  }

  onConfigureAddon(): void {
    const addon = this.card();
    if (addon) {
      const currentUrl = this.router.url;
      const baseUrl = currentUrl.split('/addons')[0];
      this.router.navigate([`${baseUrl}/addons/configure-addon`], {
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
      this.store.dispatch(new DeleteAuthorizedAddon(addonId, this.addonTypeString())).subscribe({
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
