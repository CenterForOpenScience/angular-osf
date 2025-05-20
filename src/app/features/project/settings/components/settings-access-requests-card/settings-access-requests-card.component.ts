import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'osf-settings-access-requests-card',
  imports: [Checkbox, TranslatePipe, Card],
  templateUrl: './settings-access-requests-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccessRequestsCardComponent {
  formControl = input.required<FormControl>();
}
