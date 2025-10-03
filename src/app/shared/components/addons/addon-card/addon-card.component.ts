import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { getAddonTypeString, isConfiguredAddon } from '@osf/shared/helpers';
import { CustomConfirmationService, LoaderService } from '@osf/shared/services';
import { AddonCardModel, AddonModel, AuthorizedAccountModel, ConfiguredAddonModel } from '@shared/models';
import { DeleteAuthorizedAddon } from '@shared/stores/addons';

@Component({
  selector: 'osf-addon-card',
  imports: [Button, TranslatePipe],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss',
})
export class AddonCardComponent {
  private readonly router = inject(Router);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly loaderService = inject(LoaderService);
  private readonly actions = createDispatchMap({ deleteAuthorizedAddon: DeleteAuthorizedAddon });

  readonly card = input<AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | AddonCardModel | null>(null);
  readonly isConnected = input<boolean>(false);
  readonly hasAdminAccess = input<boolean>(false);

  readonly actualAddon = computed(() => {
    const actualCard = this.card();
    if (!actualCard) return null;

    if ('isConfigured' in actualCard) {
      return actualCard.addon;
    }

    return actualCard;
  });

  readonly addonTypeString = computed(() => getAddonTypeString(this.actualAddon()));
  readonly isConfiguredAddon = computed(() => {
    const actualCard = this.card();
    if (!actualCard) return false;

    if ('isConfigured' in actualCard) {
      return actualCard.isConfigured;
    }

    return isConfiguredAddon(actualCard);
  });

  readonly canConfigure = computed(() => {
    const isConfigured = this.isConfiguredAddon();
    const hasAdmin = this.hasAdminAccess();

    if (!isConfigured) return true;

    const addon = this.card();
    if (!addon) return true;

    let isOwner = false;
    if ('configuredAddon' in addon && addon.configuredAddon) {
      isOwner = addon.configuredAddon.currentUserIsOwner;
    } else if ('currentUserIsOwner' in addon) {
      isOwner = addon.currentUserIsOwner;
    }

    return hasAdmin || isOwner;
  });

  readonly buttonLabel = computed(() => {
    const isConfigured = this.isConfiguredAddon();
    const isConnected = this.isConnected();

    if (isConfigured) {
      return 'settings.addons.form.buttons.configure';
    }

    return isConnected ? 'settings.addons.form.buttons.reconnect' : 'settings.addons.form.buttons.connect';
  });

  onConnectAddon(): void {
    const addon = this.actualAddon();
    if (addon) {
      const currentUrl = this.router.url;
      const baseUrl = currentUrl.split('/addons')[0];
      this.router.navigate([`${baseUrl}/addons/connect-addon`], {
        state: { addon },
      });
    }
  }

  onConfigureAddon(): void {
    const actualCard = this.card();
    if (!actualCard) return;

    if ('isConfigured' in actualCard && actualCard.configuredAddon) {
      const currentUrl = this.router.url;
      const baseUrl = currentUrl.split('/addons')[0];
      this.router.navigate([`${baseUrl}/addons/configure-addon`], {
        state: { addon: actualCard.configuredAddon },
      });
    } else {
      const addon = this.actualAddon();
      if (addon) {
        const currentUrl = this.router.url;
        const baseUrl = currentUrl.split('/addons')[0];
        this.router.navigate([`${baseUrl}/addons/configure-addon`], {
          state: { addon },
        });
      }
    }
  }

  showDisableDialog(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.addons.messages.deleteConfirmation.title',
      messageKey: 'settings.addons.messages.deleteConfirmation.message',
      acceptLabelKey: 'settings.addons.form.buttons.disable',
      onConfirm: () => this.onDisableAddon(),
    });
  }

  onDisableAddon(): void {
    const addon = this.actualAddon();
    const addonId = addon?.id;

    if (addonId) {
      this.loaderService.show();
      this.actions.deleteAuthorizedAddon(addonId, this.addonTypeString()).subscribe({
        complete: () => this.loaderService.hide(),
        error: () => this.loaderService.hide(),
      });
    }
  }
}
