import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';

import { TableCellData } from '@osf/features/admin-institutions/models';
import { CurrentResourceType, ResourceType, SortOrder } from '@osf/shared/enums';
import { PaginationLinksModel, ResourceModel, SearchFilters } from '@osf/shared/models';
import {
  ClearFilterSearchResults,
  FetchResources,
  FetchResourcesByLink,
  GlobalSearchSelectors,
  ResetSearchState,
  SetDefaultFilterValue,
  SetResourceType,
  SetSortBy,
} from '@shared/stores/global-search';

import { AdminTableComponent } from '../../components';
import { FiltersSectionComponent } from '../../components/filters-section/filters-section.component';
import { registrationTableColumns } from '../../constants';
import { DownloadType } from '../../enums';
import { downloadResults, INSTITUTIONS_CSV_TSV_FIELDS, INSTITUTIONS_DOWNLOAD_CSV_TSV_RESOURCE } from '../../helpers';
import { mapRegistrationResourceToTableData } from '../../mappers/institution-registration-to-table-data.mapper';
import { InstitutionsAdminSelectors } from '../../store';

@Component({
  selector: 'osf-institutions-registrations',
  imports: [CommonModule, AdminTableComponent, TranslatePipe, Button, FiltersSectionComponent],
  templateUrl: './institutions-registrations.component.html',
  styleUrl: './institutions-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsRegistrationsComponent implements OnInit, OnDestroy {
  private readonly actions = createDispatchMap({
    clearFilterSearchResults: ClearFilterSearchResults,
    setDefaultFilterValue: SetDefaultFilterValue,
    resetSearchState: ResetSearchState,
    setSortBy: SetSortBy,
    setResourceType: SetResourceType,
    fetchResources: FetchResources,
    fetchResourcesByLink: FetchResourcesByLink,
  });

  tableColumns = registrationTableColumns;
  filtersVisible = signal(false);

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

  tableData = computed(() =>
    this.resources().map(
      (resource: ResourceModel): TableCellData => mapRegistrationResourceToTableData(resource, this.institution().iri)
    )
  );
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
    } as PaginationLinksModel;
  });

  ngOnInit(): void {
    this.actions.setResourceType(ResourceType.Registration);
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
    downloadResults(
      this.selfLink(),
      type,
      INSTITUTIONS_CSV_TSV_FIELDS[CurrentResourceType.Registrations],
      INSTITUTIONS_DOWNLOAD_CSV_TSV_RESOURCE[CurrentResourceType.Registrations]
    );
  }
}
