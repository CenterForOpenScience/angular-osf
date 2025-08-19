import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FilterChipsComponent, ResourceFiltersComponent } from '@osf/features/search/components';
import { ResourceTab } from '@osf/shared/enums';
import { IS_WEB, IS_XSMALL } from '@osf/shared/helpers';
import { ResourceCardComponent, SelectComponent } from '@shared/components';
import { SEARCH_TAB_OPTIONS, searchSortingOptions } from '@shared/constants';

import { GetResourcesByLink, SearchSelectors, SetResourceTab, SetSortBy } from '../../store';
import { ResourceFiltersOptionsSelectors } from '../filters/store';
import { ResourceFiltersSelectors } from '../resource-filters/store';

@Component({
  selector: 'osf-resources',
  imports: [
    FormsModule,
    ResourceFiltersComponent,
    ReactiveFormsModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    FilterChipsComponent,
    ResourceCardComponent,
    Button,
    TranslatePipe,
    SelectComponent,
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent {
  readonly store = inject(Store);
  protected readonly searchSortingOptions = searchSortingOptions;

  selectedTabStore = select(SearchSelectors.getResourceTab);
  searchCount = select(SearchSelectors.getResourcesCount);
  resources = select(SearchSelectors.getResources);
  sortBy = select(SearchSelectors.getSortBy);
  first = select(SearchSelectors.getFirst);
  next = select(SearchSelectors.getNext);
  prev = select(SearchSelectors.getPrevious);
  isMyProfilePage = select(SearchSelectors.getIsMyProfile);

  isWeb = toSignal(inject(IS_WEB));

  isFiltersOpen = signal(false);
  isSortingOpen = signal(false);

  protected filters = select(ResourceFiltersSelectors.getAllFilters);
  protected filtersOptions = select(ResourceFiltersOptionsSelectors.getAllOptions);
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

  protected selectedTab = signal(ResourceTab.All);
  protected readonly tabsOptions = SEARCH_TAB_OPTIONS;

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
        this.store.dispatch(new SetSortBy(chosenValue));
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
        this.store.dispatch(new SetResourceTab(chosenValue));
      }
    });
  }

  switchPage(link: string) {
    this.store.dispatch(new GetResourcesByLink(link));
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
