import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { DataView } from 'primeng/dataview';
import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { CustomPaginatorComponent } from '@osf/shared/components';
import { CollectionsSelectors, SetPageNumber } from '@shared/stores/collections';

import { CollectionsSearchResultCardComponent } from '../collections-search-result-card/collections-search-result-card.component';

@Component({
  selector: 'osf-collections-search-results',
  imports: [DataView, CustomPaginatorComponent, CollectionsSearchResultCardComponent, TranslatePipe, Skeleton],
  templateUrl: './collections-search-results.component.html',
  styleUrl: './collections-search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsSearchResultsComponent {
  searchResults = select(CollectionsSelectors.getCollectionSubmissionsSearchResult);
  isCollectionDetailsLoading = select(CollectionsSelectors.getCollectionDetailsLoading);
  isCollectionSubmissionsLoading = select(CollectionsSelectors.getCollectionSubmissionsLoading);
  totalSubmissions = select(CollectionsSelectors.getTotalSubmissions);
  pageNumber = select(CollectionsSelectors.getPageNumber);

  actions = createDispatchMap({
    setPageNumber: SetPageNumber,
  });

  isLoading = computed(() => {
    return this.isCollectionDetailsLoading() || this.isCollectionSubmissionsLoading();
  });

  firstIndex = computed(() => (parseInt(this.pageNumber()) - 1) * 10);

  onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) {
      const pageNumber = (event.page + 1).toString();
      this.actions.setPageNumber(pageNumber);
    }
  }
}
