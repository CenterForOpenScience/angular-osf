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

import { LoadingSpinnerComponent } from '@shared/components';
import { searchSortingOptions } from '@shared/constants';
import { ResourceTab } from '@shared/enums';
import { Resource, TabOption } from '@shared/models';

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
  resources = input<Resource[]>([]);
  areResourcesLoading = input<boolean>(false);
  searchCount = input<number>(0);
  selectedSort = input<string>('');
  selectedTab = input<number>(ResourceTab.All);
  selectedValues = input<Record<string, string | null>>({});
  first = input<string | null>(null);
  prev = input<string | null>(null);
  next = input<string | null>(null);
  showTabs = input<boolean>(false);
  hasAnySelectedValues = input<boolean>(false);
  tabOptions = input<TabOption[]>([]);

  isFiltersOpen = signal<boolean>(false);
  isSortingOpen = signal<boolean>(false);

  sortChanged = output<string>();
  tabChanged = output<ResourceTab>();
  pageChanged = output<string>();

  protected readonly searchSortingOptions = searchSortingOptions;
  protected readonly ResourceTab = ResourceTab;

  protected readonly hasSelectedValues = computed(() => {
    const values = this.selectedValues();
    return Object.values(values).some((value) => value !== null && value !== '');
  });

  protected readonly hasFilters = computed(() => {
    //[RNi] TODO: check if there are any filters
    return true;
  });
  filtersComponent = contentChild<TemplateRef<unknown>>('filtersComponent');

  selectSort(value: string): void {
    this.sortChanged.emit(value);
  }

  selectTab(value?: ResourceTab): void {
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
