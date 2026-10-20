import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ReadonlyInputComponent } from '@osf/shared/components/readonly-input/readonly-input.component';

import { ExternalIdentity } from '../../models';
import { ExternalIdentityDeletionService } from '../../services';
import { AccountSettingsSelectors } from '../../store';

@Component({
  selector: 'osf-connected-identities',
  imports: [Card, TranslatePipe, ReadonlyInputComponent],
  templateUrl: './connected-identities.component.html',
  styleUrl: './connected-identities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedIdentitiesComponent {
  private readonly externalIdentityDeletion = inject(ExternalIdentityDeletionService);

  readonly externalIdentities = select(AccountSettingsSelectors.getExternalIdentities);

  deleteExternalIdentity(identity: ExternalIdentity): void {
    this.externalIdentityDeletion.confirmAndDelete(identity.id);
  }
}
