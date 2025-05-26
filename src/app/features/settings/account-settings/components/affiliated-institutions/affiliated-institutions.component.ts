import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserSelectors } from '@osf/core/store/user';

import { AccountSettingsSelectors, DeleteUserInstitution } from '../../store';

@Component({
  selector: 'osf-affiliated-institutions',
  imports: [TranslatePipe],
  templateUrl: './affiliated-institutions.component.html',
  styleUrl: './affiliated-institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffiliatedInstitutionsComponent {
  private readonly store = inject(Store);
  protected institutions = select(AccountSettingsSelectors.getUserInstitutions);
  protected currentUser = select(UserSelectors.getCurrentUser);

  deleteInstitution(id: string) {
    if (this.currentUser()?.id) {
      this.store.dispatch(new DeleteUserInstitution(id, this.currentUser()!.id));
    }
  }
}
