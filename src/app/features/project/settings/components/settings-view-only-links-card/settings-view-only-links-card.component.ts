import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ViewOnlyTableComponent } from '@shared/components';

import { LinkTableModel } from '../../models';

@Component({
  selector: 'osf-settings-view-only-links-card',
  imports: [Card, TranslatePipe, ViewOnlyTableComponent],
  templateUrl: './settings-view-only-links-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsViewOnlyLinksCardComponent {
  tableData = input.required<LinkTableModel[]>();
}
