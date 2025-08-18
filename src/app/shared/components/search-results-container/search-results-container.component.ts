import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, HostBinding, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SEARCH_TAB_OPTIONS, searchSortingOptions } from '@shared/constants';
import { ResourceTab } from '@shared/enums';
import { Primitive } from '@shared/helpers';
import { Resource } from '@shared/models';

import { ResourceCardComponent } from '../resource-card/resource-card.component';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'osf-search-results-container',
  imports: [FormsModule, Button, DataView, Select, ResourceCardComponent, TranslatePipe, SelectComponent],
  templateUrl: './search-results-container.component.html',
  styleUrl: './search-results-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsContainerComponent {
  @HostBinding('class') classes = 'flex flex-column gap-3';
  resources = input<Resource[]>([]);
  searchCount = input<number>(0);
  selectedSort = input<string>('');
  selectedTab = input<Primitive>(ResourceTab.All);
  selectedValues = input<Record<string, string | null>>({});
  first = input<string | null>(null);
  prev = input<string | null>(null);
  next = input<string | null>(null);
  isFiltersOpen = input<boolean>(false);
  isSortingOpen = input<boolean>(false);
  showTabs = input<boolean>(true);

  sortChanged = output<string>();
  tabChanged = output<ResourceTab>();
  pageChanged = output<string>();
  filtersToggled = output<void>();
  sortingToggled = output<void>();

  protected readonly searchSortingOptions = searchSortingOptions;
  protected readonly ResourceTab = ResourceTab;

  protected readonly tabsOptions = SEARCH_TAB_OPTIONS;

  protected readonly hasSelectedValues = computed(() => {
    const values = this.selectedValues();
    return Object.values(values).some((value) => value !== null && value !== '');
  });

  protected readonly hasFilters = computed(() => {
    return true;
  });

  selectSort(value: string): void {
    this.sortChanged.emit(value);
  }

  selectTab(value?: ResourceTab): void {
    this.tabChanged.emit((value ? value : this.selectedTab()) as ResourceTab);
  }

  switchPage(link: string | null): void {
    if (link != null) {
      this.pageChanged.emit(link);
    }
  }

  openFilters(): void {
    this.filtersToggled.emit();
  }

  openSorting(): void {
    this.sortingToggled.emit();
  }

  isAnyFilterOptions(): boolean {
    return this.hasFilters();
  }
}
