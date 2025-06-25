import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { DataView } from 'primeng/dataview';
import { PaginatorState } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { CollectionsSelectors, SetPageNumber } from '@osf/features/collections/store';
import { CustomPaginatorComponent } from '@osf/shared/components';

import { CollectionsSearchResultCardComponent } from '../collections-search-result-card/collections-search-result-card.component';

@Component({
  selector: 'osf-collections-search-results',
  imports: [DataView, CustomPaginatorComponent, CollectionsSearchResultCardComponent, TranslatePipe, Skeleton],
  templateUrl: './collections-search-results.component.html',
  styleUrl: './collections-search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsSearchResultsComponent {
  protected searchResults = select(CollectionsSelectors.getCollectionSubmissions);
  protected isCollectionDetailsLoading = select(CollectionsSelectors.getCollectionDetailsLoading);
  protected isCollectionSubmissionsLoading = select(CollectionsSelectors.getCollectionSubmissionsLoading);
  protected totalSubmissions = select(CollectionsSelectors.getTotalSubmissions);
  protected pageNumber = select(CollectionsSelectors.getPageNumber);

  protected actions = createDispatchMap({
    setPageNumber: SetPageNumber,
  });

  protected isLoading = computed(() => {
    return this.isCollectionDetailsLoading() || this.isCollectionSubmissionsLoading();
  });

  protected firstIndex = computed(() => (parseInt(this.pageNumber()) - 1) * 10);

  protected onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) {
      const pageNumber = (event.page + 1).toString();
      this.actions.setPageNumber(pageNumber);
    }
  }
}
