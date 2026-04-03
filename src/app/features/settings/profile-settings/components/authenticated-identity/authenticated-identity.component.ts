import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { finalize } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AuthService } from '@core/services/auth.service';
import { ExternalIdentityStatus } from '@osf/shared/enums/external-identity-status.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import {
  AccountSettingsSelectors,
  DeleteExternalIdentity,
  GetExternalIdentities,
} from '../../../account-settings/store';
import { ProfileSettingsTabOption } from '../../enums';

@Component({
  selector: 'osf-authenticated-identity',
  imports: [NgOptimizedImage, Button, Tooltip, TranslatePipe],
  templateUrl: './authenticated-identity.component.html',
  styleUrl: './authenticated-identity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedIdentityComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  private readonly ORCID_PROVIDER = 'ORCID';

  ngOnInit() {
    this.actions.getExternalIdentities();
  }

  readonly actions = createDispatchMap({
    deleteExternalIdentity: DeleteExternalIdentity,
    getExternalIdentities: GetExternalIdentities,
  });

  readonly externalIdentities = select(AccountSettingsSelectors.getExternalIdentities);

  readonly orcidUrl = computed(() => {
    return this.existingOrcid() ? `https://orcid.org/${this.existingOrcid()}` : null;
  });

  readonly existingOrcid = computed(
    (): string | undefined =>
      this.externalIdentities()?.find((i) => i.id === 'ORCID' && i.status === ExternalIdentityStatus.VERIFIED)
        ?.externalId
  );

  disconnectOrcid(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.accountSettings.connectedIdentities.deleteDialog.header',
      messageParams: { name: this.ORCID_PROVIDER },
      messageKey: 'settings.accountSettings.connectedIdentities.deleteDialog.message',
      onConfirm: () => {
        this.loaderService.show();
        this.actions
          .deleteExternalIdentity(this.ORCID_PROVIDER)
          .pipe(finalize(() => this.loaderService.hide()))
          .subscribe(() => this.toastService.showSuccess('settings.accountSettings.connectedIdentities.successDelete'));
      },
    });
  }

  connectOrcid(): void {
    const webUrl = this.environment.webUrl;
    const casUrl = this.environment.casUrl;
    const finalDestination = new URL(`${webUrl}/settings/profile`);
    finalDestination.searchParams.set('tab', ProfileSettingsTabOption.Social.toString());
    const casLoginUrl = new URL(`${casUrl}/login`);
    casLoginUrl.search = new URLSearchParams({
      redirectOrcid: 'true',
      service: `${webUrl}/login`,
      next: encodeURIComponent(finalDestination.toString()),
    }).toString();
    this.authService.logout(casLoginUrl.toString());
  }
}
