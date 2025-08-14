import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MyProfileFilterChipsComponent, MyProfileResourceFiltersComponent } from '@osf/features/my-profile/components';
import { SelectComponent } from '@osf/shared/components';
import { ResourceTab } from '@osf/shared/enums';
import { IS_WEB, IS_XSMALL } from '@osf/shared/helpers';
import { ResourceCardComponent } from '@shared/components/resource-card/resource-card.component';
import { SEARCH_TAB_OPTIONS, searchSortingOptions } from '@shared/constants';

import { GetResourcesByLink, MyProfileSelectors, SetResourceTab, SetSortBy } from '../../store';
import { MyProfileResourceFiltersOptionsSelectors } from '../filters/store';
import { MyProfileResourceFiltersSelectors } from '../my-profile-resource-filters/store';

@Component({
  selector: 'osf-my-profile-resources',
  imports: [
    DataView,
    MyProfileFilterChipsComponent,
    MyProfileResourceFiltersComponent,
    FormsModule,
    ResourceCardComponent,
    Button,
    SelectComponent,
    TranslatePipe,
  ],
  templateUrl: './my-profile-resources.component.html',
  styleUrl: './my-profile-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileResourcesComponent {
  private readonly actions = createDispatchMap({
    getResourcesByLink: GetResourcesByLink,
    setResourceTab: SetResourceTab,
    setSortBy: SetSortBy,
  });

  protected readonly searchSortingOptions = searchSortingOptions;

  selectedTabStore = select(MyProfileSelectors.getResourceTab);
  searchCount = select(MyProfileSelectors.getResourcesCount);
  resources = select(MyProfileSelectors.getResources);
  sortBy = select(MyProfileSelectors.getSortBy);
  first = select(MyProfileSelectors.getFirst);
  next = select(MyProfileSelectors.getNext);
  prev = select(MyProfileSelectors.getPrevious);

  isWeb = toSignal(inject(IS_WEB));

  isFiltersOpen = signal(false);
  isSortingOpen = signal(false);

  protected filters = select(MyProfileResourceFiltersSelectors.getAllFilters);
  protected filtersOptions = select(MyProfileResourceFiltersOptionsSelectors.getAllOptions);
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

  protected readonly tabsOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceTab.Users);
  protected selectedTab = signal(ResourceTab.All);

  constructor() {
    effect(() => {
      const storeValue = this.sortBy();
      const currentInput = untracked(() => this.selectedSort());

      if (storeValue && currentInput !== storeValue) {
        this.selectedSort.set(storeValue);
      }
    });

    effect(() => {
      const chosenValue = this.selectedSort();
      const storeValue = untracked(() => this.sortBy());

      if (chosenValue !== storeValue) {
        this.actions.setSortBy(chosenValue);
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
        this.actions.setResourceTab(chosenValue);
      }
    });
  }

  switchPage(link: string) {
    this.actions.getResourcesByLink(link);
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
