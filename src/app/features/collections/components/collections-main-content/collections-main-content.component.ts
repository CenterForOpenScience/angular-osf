import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { CollectionsSelectors } from '@osf/features/collections/store';
import { SORT_OPTIONS } from '@osf/features/collections/utils';
import { IS_WEB } from '@shared/utils';

import { CollectionsFilterChipsComponent } from '../collections-filter-chips/collections-filter-chips.component';
import { CollectionsFiltersComponent } from '../collections-filters/collections-filters.component';
import { CollectionsSearchResultsComponent } from '../collections-search-results/collections-search-results.component';

@Component({
  selector: 'osf-collections-main-content',
  standalone: true,
  imports: [
    NgOptimizedImage,
    Select,
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
  protected readonly sortOptions = SORT_OPTIONS;
  protected selectedSort = signal('-relevance');
  protected searchCount = signal(3);

  protected isWeb = toSignal(inject(IS_WEB));

  protected isFiltersOpen = signal(false);
  protected isSortingOpen = signal(false);

  protected filters = select(CollectionsSelectors.getAllFilters);
  protected filtersOptions = select(CollectionsSelectors.getAllFiltersOptions);

  protected isAnyFilterSelected = computed(() => {
    const currentFilters = this.filters();
    return (
      currentFilters.programArea.length ||
      currentFilters.status.length ||
      currentFilters.collectedType.length ||
      currentFilters.dataType.length ||
      currentFilters.disease.length ||
      currentFilters.gradeLevels.length ||
      currentFilters.issue.length ||
      currentFilters.reviewsState.length ||
      currentFilters.schoolType.length ||
      currentFilters.studyDesign.length ||
      currentFilters.volume.length
    );
  });

  protected isAnyFilterOptions = computed(() => {
    const currentOptions = this.filtersOptions();
    return (
      currentOptions.programArea.length ||
      currentOptions.status.length ||
      currentOptions.collectedType.length ||
      currentOptions.dataType.length ||
      currentOptions.disease.length ||
      currentOptions.gradeLevels.length ||
      currentOptions.issue.length ||
      currentOptions.reviewsState.length ||
      currentOptions.schoolType.length ||
      currentOptions.studyDesign.length ||
      currentOptions.volume.length
    );
  });

  protected openFilters(): void {
    this.isFiltersOpen.set(!this.isFiltersOpen());
    this.isSortingOpen.set(false);
  }

  protected openSorting(): void {
    this.isSortingOpen.set(!this.isSortingOpen());
    this.isFiltersOpen.set(false);
  }

  protected selectSort(value: string): void {
    this.selectedSort.set(value);
    this.openSorting();
  }
}
