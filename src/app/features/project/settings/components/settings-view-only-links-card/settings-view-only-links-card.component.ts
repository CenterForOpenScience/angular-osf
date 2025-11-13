import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ViewOnlyTableComponent } from '@osf/shared/components/view-only-table/view-only-table.component';
import {
  PaginatedViewOnlyLinksModel,
  ViewOnlyLinkModel,
} from '@osf/shared/models/view-only-links/view-only-link.model';

@Component({
  selector: 'osf-settings-view-only-links-card',
  imports: [Card, TranslatePipe, ViewOnlyTableComponent],
  templateUrl: './settings-view-only-links-card.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsViewOnlyLinksCardComponent {
  isLoading = input(false);
  tableData = input.required<PaginatedViewOnlyLinksModel>();
  deleteTableItem = output<ViewOnlyLinkModel>();
}
