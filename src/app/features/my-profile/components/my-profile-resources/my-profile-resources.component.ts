import { Store } from '@ngxs/store';

import { DataView } from 'primeng/dataview';
import { Select } from 'primeng/select';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MyProfileFilterChipsComponent, MyProfileResourceFiltersComponent } from '@osf/features/my-profile/components';
import { ResourceTab } from '@osf/shared/enums';
import { IS_WEB, IS_XSMALL } from '@osf/shared/utils';
import { ResourceCardComponent } from '@shared/components/resource-card/resource-card.component';
import { searchSortingOptions } from '@shared/constants';

import { GetResourcesByLink, MyProfileSelectors, SetResourceTab, SetSortBy } from '../../store';
import { MyProfileResourceFiltersOptionsSelectors } from '../filters/store';
import { MyProfileResourceFiltersSelectors } from '../my-profile-resource-filters/store';

@Component({
  selector: 'osf-my-profile-resources',
  imports: [
    DataView,
    MyProfileFilterChipsComponent,
    NgOptimizedImage,
    MyProfileResourceFiltersComponent,
    Select,
    FormsModule,
    ResourceCardComponent,
  ],
  templateUrl: './my-profile-resources.component.html',
  styleUrl: './my-profile-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileResourcesComponent {
  readonly #store = inject(Store);
  protected readonly searchSortingOptions = searchSortingOptions;

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
