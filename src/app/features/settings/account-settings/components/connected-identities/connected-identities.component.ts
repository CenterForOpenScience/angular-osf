import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AccountSettingsSelectors, DeleteExternalIdentity } from '../../store';

@Component({
  selector: 'osf-connected-identities',
  imports: [TranslatePipe],
  templateUrl: './connected-identities.component.html',
  styleUrl: './connected-identities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedIdentitiesComponent {
  readonly actions = createDispatchMap({ deleteExternalIdentity: DeleteExternalIdentity });
  readonly externalIdentities = select(AccountSettingsSelectors.getExternalIdentities);

  deleteExternalIdentity(id: string): void {
    this.actions.deleteExternalIdentity(id);
  }
}
