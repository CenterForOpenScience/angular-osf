import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { collectionsSortOptions } from '@osf/features/collections/constants';
import { IS_WEB } from '@osf/shared/helpers/breakpoints.tokens';
import { CollectionsSelectors, SetSortBy } from '@shared/stores/collections';

import { CollectionsFilterChipsComponent } from '../collections-filter-chips/collections-filter-chips.component';
import { CollectionsFiltersComponent } from '../collections-filters/collections-filters.component';
import { CollectionsSearchResultsComponent } from '../collections-search-results/collections-search-results.component';

@Component({
  selector: 'osf-collections-main-content',
  imports: [
    Button,
    Select,
    Skeleton,
    FormsModule,
    TranslatePipe,
    CollectionsFilterChipsComponent,
    CollectionsFiltersComponent,
    CollectionsSearchResultsComponent,
  ],
  templateUrl: './collections-main-content.component.html',
  styleUrl: './collections-main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsMainContentComponent {
  readonly sortOptions = collectionsSortOptions;

  isWeb = toSignal(inject(IS_WEB));

  actions = createDispatchMap({ setSortBy: SetSortBy });

  selectedSort = select(CollectionsSelectors.getSortBy);
  totalSubmissions = select(CollectionsSelectors.getTotalSubmissions);
  selectedFilters = select(CollectionsSelectors.getAllSelectedFilters);
  isCollectionProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  isCollectionDetailsLoading = select(CollectionsSelectors.getCollectionDetailsLoading);

  isFiltersOpen = signal(false);
  isSortingOpen = signal(false);

  isCollectionLoading = computed(() => this.isCollectionProviderLoading() || this.isCollectionDetailsLoading());

  hasAnySelectedFilters = computed(() => {
    const currentFilters = this.selectedFilters();
    const hasSelectedFiltersOptions = Object.values(currentFilters).some((value) => value.length);

    return hasSelectedFiltersOptions;
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
