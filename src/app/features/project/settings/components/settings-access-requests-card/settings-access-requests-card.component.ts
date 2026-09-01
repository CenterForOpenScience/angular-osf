import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';

@Component({
  selector: 'osf-settings-access-requests-card',
  imports: [Checkbox, TranslatePipe, Card, FormsModule, Tooltip],
  templateUrl: './settings-access-requests-card.component.html',
  styleUrl: './settings-access-requests-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccessRequestsCardComponent {
  accessRequestChange = output<boolean>();
  accessRequest = input.required<boolean>();
  isProjectReadOnly = select(UserSelectors.isProjectReadOnly);
}
