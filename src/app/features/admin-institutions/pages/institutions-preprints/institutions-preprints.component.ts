import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';

import { TABLE_PARAMS } from '@osf/shared/constants';
import { SortOrder } from '@osf/shared/enums';
import { SearchFilters } from '@osf/shared/models';

import { AdminTableComponent } from '../../components';
import { preprintsTableColumns } from '../../constants';
import { DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { mapPreprintToTableData } from '../../mappers';
import { TableCellData } from '../../models';
import { FetchPreprints, InstitutionsAdminSelectors } from '../../store';

@Component({
  selector: 'osf-institutions-preprints',
  imports: [CommonModule, AdminTableComponent, TranslatePipe],
  templateUrl: './institutions-preprints.component.html',
  styleUrl: './institutions-preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsPreprintsComponent implements OnInit {
  private readonly actions = createDispatchMap({ fetchPreprints: FetchPreprints });

  institution = select(InstitutionsAdminSelectors.getInstitution);
  preprints = select(InstitutionsAdminSelectors.getPreprints);
  totalCount = select(InstitutionsAdminSelectors.getPreprintsTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getPreprintsLoading);
  preprintsLinks = select(InstitutionsAdminSelectors.getPreprintsLinks);
  preprintsDownloadLink = select(InstitutionsAdminSelectors.getPreprintsDownloadLink);

  tableColumns = signal(preprintsTableColumns);

  currentPageSize = signal(TABLE_PARAMS.rows);
  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);
  tableData = computed(() => this.preprints().map(mapPreprintToTableData) as TableCellData[]);

  sortParam = computed(() => {
    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    return sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;
  });

  ngOnInit(): void {
    this.actions.fetchPreprints(this.sortField(), '');
  }

  onSortChange(params: SearchFilters): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    this.actions.fetchPreprints(this.sortParam(), '');
  }

  onLinkPageChange(link: string): void {
    const cursor = new URL(link).searchParams.get('page[cursor]') || '';

    this.actions.fetchPreprints(this.sortParam(), cursor);
  }

  download(type: DownloadType) {
    downloadResults(this.preprintsDownloadLink(), type);
  }
}
