import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { CollectionsFilterChipsComponent } from '@osf/features/collections/components';
import { collectionsSortOptions } from '@osf/features/collections/constants';
import { CollectionsSelectors, SetSortBy } from '@osf/features/collections/store';
import { IS_WEB } from '@shared/utils';

import { CollectionsFiltersComponent } from '../collections-filters/collections-filters.component';
import { CollectionsSearchResultsComponent } from '../collections-search-results/collections-search-results.component';

@Component({
  selector: 'osf-collections-main-content',
  imports: [
    NgOptimizedImage,
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
  protected readonly sortOptions = collectionsSortOptions;
  protected isWeb = toSignal(inject(IS_WEB));
  protected selectedSort = select(CollectionsSelectors.getSortBy);
  protected collectionSubmissions = select(CollectionsSelectors.getCollectionSubmissions);

  protected isFiltersOpen = signal(false);
  protected isSortingOpen = signal(false);

  protected selectedFilters = select(CollectionsSelectors.getAllSelectedFilters);
  protected isCollectionProviderLoading = select(CollectionsSelectors.getCollectionProviderLoading);
  protected isCollectionDetailsLoading = select(CollectionsSelectors.getCollectionDetailsLoading);

  protected isCollectionLoading = computed(() => {
    return this.isCollectionProviderLoading() || this.isCollectionDetailsLoading();
  });

  protected hasAnySelectedFilters = computed(() => {
    const currentFilters = this.selectedFilters();
    const hasSelectedFiltersOptions = Object.values(currentFilters).some((value) => {
      return value.length;
    });

    return hasSelectedFiltersOptions;
  });

  protected actions = createDispatchMap({
    setSortBy: SetSortBy,
  });

  protected openFilters(): void {
    this.isFiltersOpen.set(!this.isFiltersOpen());
    this.isSortingOpen.set(false);
  }

  protected openSorting(): void {
    this.isSortingOpen.set(!this.isSortingOpen());
    this.isFiltersOpen.set(false);
  }

  protected handleSortBy(value: string): void {
    this.actions.setSortBy(value);
    this.isSortingOpen.set(false);
  }
}
