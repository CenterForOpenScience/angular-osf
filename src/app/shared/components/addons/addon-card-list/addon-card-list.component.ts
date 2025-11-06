import { TranslatePipe } from '@ngx-translate/core';

import { Component, input } from '@angular/core';

import { AddonModel } from '@osf/shared/models/addons/addon.model';
import { AddonCardModel } from '@osf/shared/models/addons/addon-card.model';
import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';

import { AddonCardComponent } from '../addon-card/addon-card.component';

@Component({
  selector: 'osf-addon-card-list',
  imports: [AddonCardComponent, TranslatePipe],
  templateUrl: './addon-card-list.component.html',
  styleUrl: './addon-card-list.component.scss',
})
export class AddonCardListComponent {
  cards = input<(AddonModel | AuthorizedAccountModel | ConfiguredAddonModel | AddonCardModel)[]>([]);
  isConnected = input<boolean>(false);
  hasAdminAccess = input<boolean>(false);
}
