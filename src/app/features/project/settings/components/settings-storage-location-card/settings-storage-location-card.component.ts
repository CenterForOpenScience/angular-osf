import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'osf-settings-storage-location-card',
  imports: [Card, TranslatePipe],
  templateUrl: './settings-storage-location-card.component.html',
  styleUrl: '../../settings.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsStorageLocationCardComponent {
  location = input.required<string>();
  locationText = input.required<string>();
}
