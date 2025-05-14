import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserSelectors } from '@core/store/user/user.selectors';
import { DeleteUserInstitution } from '@osf/features/settings/account-settings/store/account-settings.actions';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';

@Component({
  selector: 'osf-affiliated-institutions',
  imports: [Button, TranslatePipe],
  templateUrl: './affiliated-institutions.component.html',
  styleUrl: './affiliated-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsComponent {
  readonly #store = inject(Store);
  institutions = this.#store.selectSignal(AccountSettingsSelectors.getUserInstitutions);
  currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  deleteInstitution(id: string) {
    if (this.currentUser()?.id) {
      this.#store.dispatch(new DeleteUserInstitution(id, this.currentUser()!.id));
    }
  }
}
