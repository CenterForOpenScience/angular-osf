import { TranslatePipe } from '@ngx-translate/core';

import { Component, input } from '@angular/core';

import { Addon, AddonCard, AuthorizedAccount, ConfiguredAddon } from '@shared/models';

import { AddonCardComponent } from '../addon-card/addon-card.component';

@Component({
  selector: 'osf-addon-card-list',
  imports: [AddonCardComponent, TranslatePipe],
  templateUrl: './addon-card-list.component.html',
  styleUrl: './addon-card-list.component.scss',
})
export class AddonCardListComponent {
  cards = input<(Addon | AuthorizedAccount | ConfiguredAddon | AddonCard)[]>([]);
  showDangerButton = input<boolean>(false);
}
