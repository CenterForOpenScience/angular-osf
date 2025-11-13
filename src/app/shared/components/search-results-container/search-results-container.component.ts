import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tab, TabList, Tabs } from 'primeng/tabs';

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { searchSortingOptions } from '@osf/shared/constants/search-sort-options.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { DiscoverableFilter, FilterOption } from '@shared/models/search/discaverable-filter.model';
import { ResourceModel } from '@shared/models/search/resource.model';
import { TabOption } from '@shared/models/tab-option.model';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ResourceCardComponent } from '../resource-card/resource-card.component';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'osf-search-results-container',
  imports: [
    FormsModule,
    Button,
    Select,
    ResourceCardComponent,
    TranslatePipe,
    SelectComponent,
    NgTemplateOutlet,
    Tab,
    TabList,
    Tabs,
    LoadingSpinnerComponent,
  ],
  templateUrl: './search-results-container.component.html',
  styleUrl: './search-results-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsContainerComponent {
  resources = input<ResourceModel[]>([]);
  areResourcesLoading = input<boolean>(false);
  filters = input<DiscoverableFilter[]>([]);
  searchCount = input<number>(0);
  selectedSort = input<string>('');
  selectedTab = input<number>(ResourceType.Null);
  selectedOptions = input<Record<string, FilterOption[]>>({});
  first = input<string | null>(null);
  prev = input<string | null>(null);
  next = input<string | null>(null);
  tabOptions = input<TabOption[]>([]);

  isFiltersOpen = signal<boolean>(false);
  isSortingOpen = signal<boolean>(false);
  provider = input<PreprintProviderDetails | null>(null);

  sortChanged = output<string>();
  tabChanged = output<ResourceType>();
  pageChanged = output<string>();

  showTabs = computed(() => this.tabOptions().length > 0);

  readonly searchSortingOptions = searchSortingOptions;
  readonly ResourceType = ResourceType;

  readonly hasSelectedOptions = computed(() => {
    return Object.values(this.selectedOptions()).length > 0;
  });

  readonly hasFilters = computed(() => this.filters().length > 0);
  filtersComponent = contentChild<TemplateRef<unknown>>('filtersComponent');

  selectSort(value: string): void {
    this.sortChanged.emit(value);
  }

  selectTab(value?: ResourceType): void {
    this.tabChanged.emit(value !== undefined ? value : this.selectedTab());
  }

  switchPage(link: string | null): void {
    if (link != null) {
      this.pageChanged.emit(link);
    }
  }

  openFilters(): void {
    this.isFiltersOpen.set(!this.isFiltersOpen());
    this.isSortingOpen.set(false);
  }

  openSorting(): void {
    this.isSortingOpen.set(!this.isSortingOpen());
    this.isFiltersOpen.set(false);
  }
}
