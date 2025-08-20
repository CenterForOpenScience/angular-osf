import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components';
import { TABLE_PARAMS } from '@osf/shared/constants';
import { SortOrder } from '@osf/shared/enums';
import { Institution, QueryParams } from '@osf/shared/models';
import { InstitutionsSearchSelectors } from '@osf/shared/stores';

import { AdminTableComponent } from '../../components';
import { preprintsTableColumns } from '../../constants';
import { DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { mapPreprintToTableData } from '../../mappers';
import { TableCellData } from '../../models';
import { FetchPreprints, InstitutionsAdminSelectors } from '../../store';

@Component({
  selector: 'osf-institutions-preprints',
  imports: [CommonModule, AdminTableComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './institutions-preprints.component.html',
  styleUrl: './institutions-preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsPreprintsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly actions = createDispatchMap({ fetchPreprints: FetchPreprints });

  private institutionId = '';

  institution = select(InstitutionsSearchSelectors.getInstitution);
  preprints = select(InstitutionsAdminSelectors.getPreprints);
  totalCount = select(InstitutionsAdminSelectors.getPreprintsTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getPreprintsLoading);
  preprintsLinks = select(InstitutionsAdminSelectors.getPreprintsLinks);
  preprintsDownloadLink = select(InstitutionsAdminSelectors.getPreprintsDownloadLink);

  tableColumns = signal(preprintsTableColumns);

  currentPageSize = signal(TABLE_PARAMS.rows);
  currentSort = signal('-dateModified');
  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  currentCursor = signal('');

  tableData = computed(() => this.preprints().map(mapPreprintToTableData) as TableCellData[]);

  ngOnInit(): void {
    this.getPreprints();
  }

  onSortChange(params: QueryParams): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    const sortField = params.sortColumn || '-dateModified';
    const sortOrder = params.sortOrder || 1;
    const sortParam = sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchPreprints(this.institutionId, institutionIris, this.currentPageSize(), sortParam, '');
  }

  onLinkPageChange(link: string): void {
    const url = new URL(link);
    const cursor = url.searchParams.get('page[cursor]') || '';

    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    const sortParam = sortOrder === -1 ? `-${sortField}` : sortField;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchPreprints(this.institutionId, institutionIris, this.currentPageSize(), sortParam, cursor);
  }

  download(type: DownloadType) {
    downloadResults(this.preprintsDownloadLink(), type);
  }

  private getPreprints(): void {
    const institutionId = this.route.parent?.snapshot.params['institution-id'];
    if (!institutionId) return;

    this.institutionId = institutionId;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchPreprints(this.institutionId, institutionIris, this.currentPageSize(), this.sortField(), '');
  }
}
