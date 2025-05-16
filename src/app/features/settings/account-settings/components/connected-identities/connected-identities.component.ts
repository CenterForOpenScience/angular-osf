import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DeleteExternalIdentity } from '@osf/features/settings/account-settings/store/account-settings.actions';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';

@Component({
  selector: 'osf-connected-identities',
  imports: [TranslatePipe],
  templateUrl: './connected-identities.component.html',
  styleUrl: './connected-identities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedIdentitiesComponent {
  readonly #store = inject(Store);
  readonly externalIdentities = this.#store.selectSignal(AccountSettingsSelectors.getExternalIdentities);

  deleteExternalIdentity(id: string): void {
    this.#store.dispatch(new DeleteExternalIdentity(id));
  }
}
