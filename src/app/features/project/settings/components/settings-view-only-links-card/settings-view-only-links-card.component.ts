import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LinkTableModel } from '@osf/features/project/settings/models';
import { ViewOnlyTableComponent } from '@shared/components';

@Component({
  selector: 'osf-settings-view-only-links-card',
  imports: [Card, TranslatePipe, ViewOnlyTableComponent],
  templateUrl: './settings-view-only-links-card.component.html',
  styleUrl: '../../settings.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsViewOnlyLinksCardComponent {
  tableData = input.required<LinkTableModel[]>();
}
