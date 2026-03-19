import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { finalize } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import {
  AccountSettingsSelectors,
  DeleteExternalIdentity,
  GetExternalIdentities,
} from '../../../account-settings/store';

@Component({
  selector: 'osf-authenticated-identity',
  imports: [NgOptimizedImage, Button, Tooltip, TranslatePipe],
  templateUrl: './authenticated-identity.component.html',
  styleUrl: './authenticated-identity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedIdentityComponent {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  constructor() {
    effect(() => {
      this.actions.getExternalIdentities();
    });
  }

  readonly actions = createDispatchMap({
    deleteExternalIdentity: DeleteExternalIdentity,
    getExternalIdentities: GetExternalIdentities,
  });

  readonly externalIdentities = select(AccountSettingsSelectors.getExternalIdentities);

  readonly orcidUrl = computed(() => {
    return this.existingOrcid ? `https://orcid.org/${this.existingOrcid}` : null;
  });

  get existingOrcid(): string | undefined {
    const externalIdentities = this.externalIdentities();
    const existingOrcid = externalIdentities?.find((identity) => identity.id === 'ORCID');
    if (existingOrcid && existingOrcid.status === 'VERIFIED') {
      return existingOrcid.externalId;
    }
    return undefined;
  }

  disconnectOrcid(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.accountSettings.connectedIdentities.deleteDialog.header',
      messageParams: { name: 'ORCID' },
      messageKey: 'settings.accountSettings.connectedIdentities.deleteDialog.message',
      onConfirm: () => {
        this.loaderService.show();
        this.actions
          .deleteExternalIdentity('ORCID')
          .pipe(finalize(() => this.loaderService.hide()))
          .subscribe(() => this.toastService.showSuccess('settings.accountSettings.connectedIdentities.successDelete'));
      },
    });
  }

  connectOrcid(): void {
    /* no-op for now*/
  }
}
