import { Component, input } from '@angular/core';
import { AddonCardComponent } from '@osf/features/settings/addons/addon-card/addon-card.component';
import { AddonCard } from '@shared/entities/addon-card.interface';

@Component({
  selector: 'osf-addon-card-list',
  imports: [AddonCardComponent],
  templateUrl: './addon-card-list.component.html',
  styleUrl: './addon-card-list.component.scss',
})
export class AddonCardListComponent {
  cards = input<AddonCard[]>([]);
  cardButtonLabel = input<string>('');
}
