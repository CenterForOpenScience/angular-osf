import { TranslatePipe } from '@ngx-translate/core';

import { Component, input } from '@angular/core';

import { AddonModel, AuthorizedAccountModel, ConfiguredAddonModel } from '@osf/shared/models';

import { AddonCardComponent } from '../addon-card/addon-card.component';

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
