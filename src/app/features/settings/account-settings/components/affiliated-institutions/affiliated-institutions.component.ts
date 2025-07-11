import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  private readonly actions = createDispatchMap({ deleteUserInstitution: DeleteUserInstitution });
  protected institutions = select(AccountSettingsSelectors.getUserInstitutions);
  protected currentUser = select(UserSelectors.getCurrentUser);

  deleteInstitution(id: string) {
    if (this.currentUser()?.id) {
      this.actions.deleteUserInstitution(id, this.currentUser()!.id);
    }
  }
}
