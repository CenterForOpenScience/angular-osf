import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-settings-access-requests-card',
  imports: [Checkbox, TranslatePipe, Card, FormsModule],
  templateUrl: './settings-access-requests-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccessRequestsCardComponent {
  accessRequestChange = output<boolean>();
  accessRequest = input.required<boolean>();
}
