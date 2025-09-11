import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { CollectionsFilterChipsComponent } from '@osf/features/collections/components';
import { collectionsSortOptions } from '@osf/features/collections/constants';
import { IS_WEB } from '@osf/shared/helpers';
import { CollectionsSelectors, SetSortBy } from '@shared/stores/collections';

import { CollectionsFiltersComponent } from '../collections-filters/collections-filters.component';
import { CollectionsSearchResultsComponent } from '../collections-search-results/collections-search-results.component';

@Component({
  selector: 'osf-collections-main-content',
  imports: [
    Button,
    Select,
    FormsModule,
    TranslatePipe,
    CollectionsFilterChipsComponent,
    CollectionsFiltersComponent,
    CollectionsSearchResultsComponent,
    Skeleton,
  ],
  templateUrl: './collections-main-content.component.html',
  styleUrl: './collections-main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsMainContentComponent {
  readonly sortOptions = collectionsSortOptions;
  isWeb = toSignal(inject(IS_WEB));
  selectedSort = select(CollectionsSelectors.getSortBy);
  collectionSubmissions = select(CollectionsSelectors.getCollectionSubmissionsSearchResult);
  isCollectionSubmissionsLoading = select(CollectionsSelectors.getCollectionSubmissionsLoading);

  isFiltersOpen = signal(false);
  isSortingOpen = signal(false);

  selectedFilters = select(CollectionsSelectors.getAllSelectedFilters);
  isCollectionProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  isCollectionDetailsLoading = select(CollectionsSelectors.getCollectionDetailsLoading);

  isCollectionLoading = computed(() => {
    return this.isCollectionProviderLoading() || this.isCollectionDetailsLoading();
  });

  hasAnySelectedFilters = computed(() => {
    const currentFilters = this.selectedFilters();
    const hasSelectedFiltersOptions = Object.values(currentFilters).some((value) => {
      return value.length;
    });

    return hasSelectedFiltersOptions;
  });

  actions = createDispatchMap({
    setSortBy: SetSortBy,
  });

  openFilters(): void {
    this.isFiltersOpen.set(!this.isFiltersOpen());
    this.isSortingOpen.set(false);
  }

  openSorting(): void {
    this.isSortingOpen.set(!this.isSortingOpen());
    this.isFiltersOpen.set(false);
  }

  handleSortBy(value: string): void {
    this.actions.setSortBy(value);
    this.isSortingOpen.set(false);
  }
}
