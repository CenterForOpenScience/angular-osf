import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AuthService } from '@core/services/auth.service';
import { ExternalIdentityStatus } from '@osf/shared/enums/external-identity-status.enum';

import { ExternalIdentityDeletionService } from '../../../account-settings/services';
import { AccountSettingsSelectors, GetExternalIdentities } from '../../../account-settings/store';
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
  private readonly externalIdentityDeletion = inject(ExternalIdentityDeletionService);

  private readonly ORCID_PROVIDER = 'ORCID';

  ngOnInit() {
    this.actions.getExternalIdentities();
  }

  readonly actions = createDispatchMap({
    getExternalIdentities: GetExternalIdentities,
  });

  readonly externalIdentities = select(AccountSettingsSelectors.getExternalIdentities);

  readonly orcidUrl = computed(() => (this.existingOrcid() ? `https://orcid.org/${this.existingOrcid()}` : null));

  readonly existingOrcid = computed(
    (): string | undefined =>
      this.externalIdentities()?.find((i) => i.id === 'ORCID' && i.status === ExternalIdentityStatus.VERIFIED)
        ?.externalId
  );

  disconnectOrcid(): void {
    this.externalIdentityDeletion.confirmAndDelete(this.ORCID_PROVIDER);
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
