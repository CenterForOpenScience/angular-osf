import { Component, input } from '@angular/core';
import { AddonCardComponent } from '@osf/features/settings/addons/addon-card/addon-card.component';
import { Addon } from '@shared/entities/addons.entities';

@Component({
  selector: 'osf-addon-card-list',
  imports: [AddonCardComponent],
  templateUrl: './addon-card-list.component.html',
  styleUrl: './addon-card-list.component.scss',
})
export class AddonCardListComponent {
  cards = input<Addon[]>([]);
  cardButtonLabel = input<string>('');
}
