import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';

import { FiltersSectionComponent } from '@osf/features/admin-institutions/components/filters-section/filters-section.component';
import { mapPreprintResourceToTableData } from '@osf/features/admin-institutions/mappers/institution-preprint-to-table-data.mapper';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { SearchFilters } from '@osf/shared/models';
import {
  FetchResources,
  FetchResourcesByLink,
  GlobalSearchSelectors,
  ResetSearchState,
  SetDefaultFilterValue,
  SetResourceType,
  SetSortBy,
} from '@shared/stores/global-search';

import { AdminTableComponent } from '../../components';
import { preprintsTableColumns } from '../../constants';
import { DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { TableCellData } from '../../models';
import { InstitutionsAdminSelectors } from '../../store';

@Component({
  selector: 'osf-institutions-preprints',
  imports: [CommonModule, AdminTableComponent, TranslatePipe, Button, FiltersSectionComponent],
  templateUrl: './institutions-preprints.component.html',
  styleUrl: './institutions-preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsPreprintsComponent implements OnInit, OnDestroy {
  private actions = createDispatchMap({
    setDefaultFilterValue: SetDefaultFilterValue,
    resetSearchState: ResetSearchState,
    setSortBy: SetSortBy,
    setResourceType: SetResourceType,
    fetchResources: FetchResources,
    fetchResourcesByLink: FetchResourcesByLink,
  });

  tableColumns = preprintsTableColumns;
  filtersVisible = signal(false);

  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  institution = select(InstitutionsAdminSelectors.getInstitution);

  resources = select(GlobalSearchSelectors.getResources);
  resourcesCount = select(GlobalSearchSelectors.getResourcesCount);
  areResourcesLoading = select(GlobalSearchSelectors.getResourcesLoading);

  selfLink = select(GlobalSearchSelectors.getFirst);
  firstLink = select(GlobalSearchSelectors.getFirst);
  nextLink = select(GlobalSearchSelectors.getNext);
  previousLink = select(GlobalSearchSelectors.getPrevious);

  tableData = computed(() => this.resources().map(mapPreprintResourceToTableData) as TableCellData[]);

  sortParam = computed(() => {
    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    return sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;
  });

  paginationLinks = computed(() => {
    return {
      next: { href: this.nextLink() },
      prev: { href: this.previousLink() },
      first: { href: this.firstLink() },
    };
  });

  ngOnInit(): void {
    this.actions.setResourceType(ResourceType.Preprint);
    this.actions.setDefaultFilterValue('affiliation', this.institution().iris.join(','));
    this.actions.fetchResources();
  }

  ngOnDestroy() {
    this.actions.resetSearchState();
  }

  onSortChange(params: SearchFilters): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    this.actions.setSortBy(this.sortParam());
    this.actions.fetchResources();
  }

  onLinkPageChange(link: string): void {
    this.actions.fetchResourcesByLink(link);
  }

  download(type: DownloadType) {
    downloadResults(this.selfLink(), type);
  }
}
