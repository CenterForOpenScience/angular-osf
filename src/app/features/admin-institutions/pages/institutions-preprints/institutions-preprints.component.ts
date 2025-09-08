import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';

import { mapPreprintResourceToTableData } from '@osf/features/admin-institutions/mappers/institution-preprint-to-table-data.mapper';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { DiscoverableFilter, SearchFilters } from '@osf/shared/models';
import { FilterChipsComponent, ReusableFilterComponent } from '@shared/components';
import { StringOrNull } from '@shared/helpers';
import {
  ClearFilterSearchResults,
  FetchResources,
  FetchResourcesByLink,
  GlobalSearchSelectors,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  ResetSearchState,
  SetDefaultFilterValue,
  SetResourceType,
  SetSortBy,
  UpdateFilterValue,
} from '@shared/stores/global-search';

import { AdminTableComponent } from '../../components';
import { preprintsTableColumns } from '../../constants';
import { DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { TableCellData } from '../../models';
import { InstitutionsAdminSelectors } from '../../store';

@Component({
  selector: 'osf-institutions-preprints',
  imports: [
    CommonModule,
    AdminTableComponent,
    TranslatePipe,
    Button,
    FilterChipsComponent,
    Popover,
    ReusableFilterComponent,
  ],
  templateUrl: './institutions-preprints.component.html',
  styleUrl: './institutions-preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsPreprintsComponent implements OnInit, OnDestroy {
  private actions = createDispatchMap({
    loadFilterOptions: LoadFilterOptions,
    loadFilterOptionsAndSetValues: LoadFilterOptionsAndSetValues,
    loadFilterOptionsWithSearch: LoadFilterOptionsWithSearch,
    loadMoreFilterOptions: LoadMoreFilterOptions,
    updateFilterValue: UpdateFilterValue,
    clearFilterSearchResults: ClearFilterSearchResults,
    setDefaultFilterValue: SetDefaultFilterValue,
    resetSearchState: ResetSearchState,
    setSortBy: SetSortBy,
    setResourceType: SetResourceType,
    fetchResources: FetchResources,
    fetchResourcesByLink: FetchResourcesByLink,
  });

  tableColumns = preprintsTableColumns;

  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  institution = select(InstitutionsAdminSelectors.getInstitution);

  resources = select(GlobalSearchSelectors.getResources);
  areResourcesLoading = select(GlobalSearchSelectors.getResourcesLoading);
  resourcesCount = select(GlobalSearchSelectors.getResourcesCount);

  selfLink = select(GlobalSearchSelectors.getFirst);
  firstLink = select(GlobalSearchSelectors.getFirst);
  nextLink = select(GlobalSearchSelectors.getNext);
  previousLink = select(GlobalSearchSelectors.getPrevious);

  filters = select(GlobalSearchSelectors.getFilters);
  filterValues = select(GlobalSearchSelectors.getFilterValues);
  filterSearchCache = select(GlobalSearchSelectors.getFilterSearchCache);
  filterOptionsCache = select(GlobalSearchSelectors.getFilterOptionsCache);

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

  onLoadFilterOptions(filter: DiscoverableFilter): void {
    this.actions.loadFilterOptions(filter.key);
  }

  onLoadMoreFilterOptions(event: { filterType: string; filter: DiscoverableFilter }): void {
    this.actions.loadMoreFilterOptions(event.filterType);
  }

  onFilterSearchChanged(event: { filterType: string; searchText: string; filter: DiscoverableFilter }): void {
    if (event.searchText.trim()) {
      this.actions.loadFilterOptionsWithSearch(event.filterType, event.searchText);
    } else {
      this.actions.clearFilterSearchResults(event.filterType);
    }
  }

  onFilterChanged(event: { filterType: string; value: StringOrNull }): void {
    this.actions.updateFilterValue(event.filterType, event.value);
    this.actions.fetchResources();
  }

  onFilterChipRemoved(filterKey: string): void {
    this.actions.updateFilterValue(filterKey, null);
    this.actions.fetchResources();
  }
}
