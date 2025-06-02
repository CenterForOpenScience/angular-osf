import { DataView } from 'primeng/dataview';
import { Paginator } from 'primeng/paginator';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CollectionsSearchResultCardComponent } from '@osf/features/collections/components';
import { CollectionSearchResultCard } from '@osf/features/collections/models';
import { SEARCH_RESULT_CARDS_DATA } from '@osf/features/collections/utils';

@Component({
  selector: 'osf-collections-search-results',
  imports: [DataView, Paginator, CollectionsSearchResultCardComponent],
  templateUrl: './collections-search-results.component.html',
  styleUrl: './collections-search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsSearchResultsComponent {
  protected searchResults: CollectionSearchResultCard[] = SEARCH_RESULT_CARDS_DATA;
}
