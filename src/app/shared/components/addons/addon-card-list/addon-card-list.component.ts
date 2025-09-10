import { TranslatePipe } from '@ngx-translate/core';

import { Component, input } from '@angular/core';

import { AddonCardComponent } from '@shared/components/addons';
import { AddonModel, AuthorizedAccountModel, ConfiguredAddonModel } from '@shared/models';

@Component({
  selector: 'osf-addon-card-list',
  imports: [AddonCardComponent, TranslatePipe],
  templateUrl: './addon-card-list.component.html',
  styleUrl: './addon-card-list.component.scss',
})
export class AddonCardListComponent {
  cards = input<(AddonModel | AuthorizedAccountModel | ConfiguredAddonModel)[]>([]);
  cardButtonLabel = input<string>('');
  showDangerButton = input<boolean>(false);
}
