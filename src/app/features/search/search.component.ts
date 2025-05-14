import { Store } from '@ngxs/store';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { debounceTime, skip } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';
import {
  GetResources,
  ResetSearchState,
  SearchSelectors,
  SetResourceTab,
  SetSearchText,
} from '@osf/features/search/store';
import { GetAllOptions } from '@shared/components/resources/resource-filters/filters/store/resource-filters-options.actions';
import { ResetFiltersState, ResourceFiltersSelectors } from '@shared/components/resources/resource-filters/store';
import { ResourcesWrapperComponent } from '@shared/components/resources/resources-wrapper/resources-wrapper.component';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-search',
  imports: [
    SearchInputComponent,
    DropdownModule,
    ReactiveFormsModule,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    NgOptimizedImage,
    AutoCompleteModule,
    FormsModule,
    AccordionModule,
    TableModule,
    DataViewModule,
    Button,
    ResourcesWrapperComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnDestroy {
  readonly #store = inject(Store);

  protected searchValue = signal('');
  protected readonly isMobile = toSignal(inject(IS_XSMALL));

  protected readonly creatorsFilter = this.#store.selectSignal(ResourceFiltersSelectors.getCreator);
  protected readonly dateCreatedFilter = this.#store.selectSignal(ResourceFiltersSelectors.getDateCreated);
  protected readonly funderFilter = this.#store.selectSignal(ResourceFiltersSelectors.getFunder);
  protected readonly subjectFilter = this.#store.selectSignal(ResourceFiltersSelectors.getSubject);
  protected readonly licenseFilter = this.#store.selectSignal(ResourceFiltersSelectors.getLicense);
  protected readonly resourceTypeFilter = this.#store.selectSignal(ResourceFiltersSelectors.getResourceType);
  protected readonly institutionFilter = this.#store.selectSignal(ResourceFiltersSelectors.getInstitution);
  protected readonly providerFilter = this.#store.selectSignal(ResourceFiltersSelectors.getProvider);
  protected readonly partOfCollectionFilter = this.#store.selectSignal(ResourceFiltersSelectors.getPartOfCollection);
  protected searchStoreValue = this.#store.selectSignal(SearchSelectors.getSearchText);
  protected resourcesTabStoreValue = this.#store.selectSignal(SearchSelectors.getResourceTab);
  protected sortByStoreValue = this.#store.selectSignal(SearchSelectors.getSortBy);
  readonly isMyProfilePage = this.#store.selectSignal(SearchSelectors.getIsMyProfile);

  protected selectedTab: ResourceTab = ResourceTab.All;
  protected readonly ResourceTab = ResourceTab;
  protected currentStep = 0;

  constructor() {
    effect(() => {
      this.creatorsFilter();
      this.dateCreatedFilter();
      this.funderFilter();
      this.subjectFilter();
      this.licenseFilter();
      this.resourceTypeFilter();
      this.institutionFilter();
      this.providerFilter();
      this.partOfCollectionFilter();
      this.searchStoreValue();
      this.resourcesTabStoreValue();
      this.sortByStoreValue();
      this.#store.dispatch(GetResources);
    });

    // put search value in store and update resources, filters
    toObservable(this.searchValue)
      .pipe(skip(1), debounceTime(500))
      .subscribe((searchText) => {
        this.#store.dispatch(new SetSearchText(searchText));
        this.#store.dispatch(GetAllOptions);
      });

    // sync search with query parameters if search is empty and parameters are not
    effect(() => {
      const storeValue = this.searchStoreValue();
      const currentInput = untracked(() => this.searchValue());

      if (storeValue && currentInput !== storeValue) {
        this.searchValue.set(storeValue);
      }
    });

    // sync resource tabs with store
    effect(() => {
      if (this.selectedTab !== this.resourcesTabStoreValue()) {
        this.selectedTab = this.resourcesTabStoreValue();
      }
    });
  }

  onTabChange(index: ResourceTab): void {
    this.#store.dispatch(new SetResourceTab(index));
    this.selectedTab = index;
    this.#store.dispatch(GetAllOptions);
  }

  ngOnDestroy(): void {
    this.#store.dispatch(ResetFiltersState);
    this.#store.dispatch(ResetSearchState);
  }
}
