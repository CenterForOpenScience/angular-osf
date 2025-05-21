import { Store } from '@ngxs/store';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DataViewModule } from 'primeng/dataview';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FilterChipsComponent } from '@osf/features/search/components/resources/components/filter-chips/filter-chips.component';
import { ResourceCardComponent } from '@osf/features/search/components/resources/components/resource-card/resource-card.component';
import { ResourceFiltersOptionsSelectors } from '@osf/features/search/components/resources/components/resource-filters/components/filters/store/resource-filters-options.selectors';
import { ResourceFiltersComponent } from '@osf/features/search/components/resources/components/resource-filters/resource-filters.component';
import { GetResourcesByLink, SearchSelectors, SetResourceTab, SetSortBy } from '@osf/features/search/store';
import { ResourceTab } from '@shared/entities/resource-card/resource-tab.enum';
import { IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { ResourceFiltersSelectors } from 'src/app/features/search/components/resources/components/resource-filters/store';

@Component({
  selector: 'osf-resources',
  imports: [
    FormsModule,
    ResourceFiltersComponent,
    ReactiveFormsModule,
    AutoCompleteModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    ResourceCardComponent,
    FilterChipsComponent,
    Select,
    NgOptimizedImage,
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent {
  readonly #store = inject(Store);

  selectedTabStore = this.#store.selectSignal(SearchSelectors.getResourceTab);
  searchCount = this.#store.selectSignal(SearchSelectors.getResourcesCount);
  resources = this.#store.selectSignal(SearchSelectors.getResources);
  sortBy = this.#store.selectSignal(SearchSelectors.getSortBy);
  first = this.#store.selectSignal(SearchSelectors.getFirst);
  next = this.#store.selectSignal(SearchSelectors.getNext);
  prev = this.#store.selectSignal(SearchSelectors.getPrevious);
  isMyProfilePage = this.#store.selectSignal(SearchSelectors.getIsMyProfile);

  isWeb = toSignal(inject(IS_WEB));

  isFiltersOpen = signal(false);
  isSortingOpen = signal(false);

  protected filters = this.#store.selectSignal(ResourceFiltersSelectors.getAllFilters);
  protected filtersOptions = this.#store.selectSignal(ResourceFiltersOptionsSelectors.getAllOptions);
  protected isAnyFilterSelected = computed(() => {
    return (
      this.filters().creator.value ||
      this.filters().dateCreated.value ||
      this.filters().funder.value ||
      this.filters().subject.value ||
      this.filters().license.value ||
      this.filters().resourceType.value ||
      this.filters().institution.value ||
      this.filters().provider.value ||
      this.filters().partOfCollection.value
    );
  });
  protected isAnyFilterOptions = computed(() => {
    return (
      this.filtersOptions().datesCreated.length > 0 ||
      this.filtersOptions().creators.length > 0 ||
      this.filtersOptions().funders.length > 0 ||
      this.filtersOptions().subjects.length > 0 ||
      this.filtersOptions().licenses.length > 0 ||
      this.filtersOptions().resourceTypes.length > 0 ||
      this.filtersOptions().institutions.length > 0 ||
      this.filtersOptions().providers.length > 0 ||
      this.filtersOptions().partOfCollection.length > 0 ||
      !this.isMyProfilePage()
    );
  });

  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  protected selectedSort = signal('');
  protected readonly sortTabOptions = [
    { label: 'Relevance', value: '-relevance' },
    { label: 'Date created (newest)', value: '-dateCreated' },
    { label: 'Date created (oldest)', value: 'dateCreated' },
    { label: 'Date modified (newest)', value: '-dateModified' },
    { label: 'Date modified (oldest)', value: 'dateModified' },
  ];

  protected selectedTab = signal(ResourceTab.All);
  protected readonly tabsOptions = [
    { label: 'All', value: ResourceTab.All },
    { label: 'Projects', value: ResourceTab.Projects },
    { label: 'Registrations', value: ResourceTab.Registrations },
    { label: 'Preprints', value: ResourceTab.Preprints },
    { label: 'Files', value: ResourceTab.Files },
    { label: 'Users', value: ResourceTab.Users },
  ];

  constructor() {
    // if new value for sorting in store, update value in dropdown
    effect(() => {
      const storeValue = this.sortBy();
      const currentInput = untracked(() => this.selectedSort());

      if (storeValue && currentInput !== storeValue) {
        this.selectedSort.set(storeValue);
      }
    });

    // if the sorting was changed, set new value to store
    effect(() => {
      const chosenValue = this.selectedSort();
      const storeValue = untracked(() => this.sortBy());

      if (chosenValue !== storeValue) {
        this.#store.dispatch(new SetSortBy(chosenValue));
      }
    });

    effect(() => {
      const storeValue = this.selectedTabStore();
      const currentInput = untracked(() => this.selectedTab());

      if (storeValue && currentInput !== storeValue) {
        this.selectedTab.set(storeValue);
      }
    });

    effect(() => {
      const chosenValue = this.selectedTab();
      const storeValue = untracked(() => this.selectedTabStore());

      if (chosenValue !== storeValue) {
        this.#store.dispatch(new SetResourceTab(chosenValue));
      }
    });
  }

  // pagination
  switchPage(link: string) {
    this.#store.dispatch(new GetResourcesByLink(link));
  }

  openFilters() {
    this.isFiltersOpen.set(!this.isFiltersOpen());
    this.isSortingOpen.set(false);
  }

  openSorting() {
    this.isSortingOpen.set(!this.isSortingOpen());
    this.isFiltersOpen.set(false);
  }

  selectSort(value: string) {
    this.selectedSort.set(value);
    this.openSorting();
  }
}
