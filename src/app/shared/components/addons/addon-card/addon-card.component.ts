import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { CustomConfirmationService, LoaderService } from '@osf/shared/services';
import { Addon, AuthorizedAddon, ConfiguredAddon } from '@shared/models';
import { DeleteAuthorizedAddon } from '@shared/stores/addons';
import { getAddonTypeString, isConfiguredAddon } from '@shared/utils';

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

  readonly card = input<Addon | AuthorizedAddon | ConfiguredAddon | null>(null);
  readonly cardButtonLabel = input<string>('');
  readonly showDangerButton = input<boolean>(false);

  protected readonly addonTypeString = computed(() => {
    return getAddonTypeString(this.card());
  });
  protected readonly isConfiguredAddon = computed(() => {
    return isConfiguredAddon(this.card());
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
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.addons.messages.deleteConfirmation.title',
      messageKey: 'settings.addons.messages.deleteConfirmation.message',
      acceptLabelKey: 'settings.addons.form.buttons.disable',
      onConfirm: () => this.onDisableAddon(),
    });
  }

  onDisableAddon(): void {
    const addonId = this.card()?.id;

    if (addonId) {
      this.loaderService.show();
      this.actions.deleteAuthorizedAddon(addonId, this.addonTypeString()).subscribe({
        complete: () => this.loaderService.hide(),
        error: () => this.loaderService.hide(),
      });
    }
  }
}
