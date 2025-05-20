import { Store } from '@ngxs/store';

import { DataView } from 'primeng/dataview';
import { Select } from 'primeng/select';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MyProfileFilterChipsComponent } from '@osf/features/my-profile/components/resources/components/filter-chips/my-profile-filter-chips.component';
import { MyProfileResourceCardComponent } from '@osf/features/my-profile/components/resources/components/resource-card/my-profile-resource-card.component';
import { MyProfileResourceFiltersOptionsSelectors } from '@osf/features/my-profile/components/resources/components/resource-filters/components/filters/store/my-profile-resource-filters-options.selectors';
import { MyProfileResourceFiltersComponent } from '@osf/features/my-profile/components/resources/components/resource-filters/my-profile-resource-filters.component';
import { MyProfileResourceFiltersSelectors } from '@osf/features/my-profile/components/resources/components/resource-filters/store/my-profile-resource-filters.selectors';
import { GetResourcesByLink, SetResourceTab, SetSortBy } from '@osf/features/my-profile/store/my-profile.actions';
import { MyProfileSelectors } from '@osf/features/my-profile/store/my-profile.selectors';
import { ResourceTab } from '@shared/entities/resource-card/resource-tab.enum';
import { IS_WEB, IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-my-profile-resources',
  imports: [
    DataView,
    MyProfileFilterChipsComponent,
    NgOptimizedImage,
    MyProfileResourceCardComponent,
    MyProfileResourceFiltersComponent,
    Select,
    FormsModule,
  ],
  templateUrl: './my-profile-resources.component.html',
  styleUrl: './my-profile-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileResourcesComponent {
  readonly #store = inject(Store);

  selectedTabStore = this.#store.selectSignal(MyProfileSelectors.getResourceTab);
  searchCount = this.#store.selectSignal(MyProfileSelectors.getResourcesCount);
  resources = this.#store.selectSignal(MyProfileSelectors.getResources);
  sortBy = this.#store.selectSignal(MyProfileSelectors.getSortBy);
  first = this.#store.selectSignal(MyProfileSelectors.getFirst);
  next = this.#store.selectSignal(MyProfileSelectors.getNext);
  prev = this.#store.selectSignal(MyProfileSelectors.getPrevious);

  isWeb = toSignal(inject(IS_WEB));

  isFiltersOpen = signal(false);
  isSortingOpen = signal(false);

  protected filters = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getAllFilters);
  protected filtersOptions = this.#store.selectSignal(MyProfileResourceFiltersOptionsSelectors.getAllOptions);
  protected isAnyFilterSelected = computed(() => {
    return (
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
      this.filtersOptions().funders.length > 0 ||
      this.filtersOptions().subjects.length > 0 ||
      this.filtersOptions().licenses.length > 0 ||
      this.filtersOptions().resourceTypes.length > 0 ||
      this.filtersOptions().institutions.length > 0 ||
      this.filtersOptions().providers.length > 0 ||
      this.filtersOptions().partOfCollection.length > 0
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
